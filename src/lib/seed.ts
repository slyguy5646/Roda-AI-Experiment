import { readFile } from "fs/promises";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import fs from "node:fs";
import { parse } from "csv-parse";
import { finished } from "stream/promises";
import { createEmbeddings } from "./embeds";
import { v4 } from "uuid";
import pgvector from "pgvector/pg";

const imageDataUrlRegex = /data:image[^"]+"/g;
const htmlRegex = /<[^>]+>/g;

async function seedDB() {
  const rows = await readCSV();

  rows.shift();

  const data: Array<Prisma.ServiceCreateManyInput | null> = rows
    .map((row) => {
      const title = row[0];
      const icon = row[2];
      const description = row[3]
        ? row[3].replace(imageDataUrlRegex, "").replace(htmlRegex, "").trim()
        : null;

      if (!title) return null;

      return {
        id: v4(),
        title: title.replace(htmlRegex, "").trim(),
        icon,
        description,
        embeddingString: row
          .join(" ")
          .replace(imageDataUrlRegex, "")
          .replace(htmlRegex, ""),
      };
    })
    .filter((i) => i !== null);

  await prisma.service.createMany({
    data: data as Prisma.ServiceCreateManyInput[],
  });

  const embeddings = await createEmbeddings(
    (data as Prisma.ServiceCreateManyInput[]).map((e) => e.embeddingString)
  );

  await Promise.all(
    embeddings.map((e, i) => {
      const embedding = pgvector.toSql(e);
      return prisma.$executeRaw`UPDATE "Service" SET embedding = ${embedding}::vector WHERE id = ${data[i]?.id}`;
    })
  );
}

seedDB();

async function readCSV() {
  const records: string[][] = [];
  const parser = fs
    .createReadStream(
      `/Users/liammonaghan/Roda/ai-experiment/roda-prod-services-table.csv`
    )
    .pipe(parse({}));
  parser.on("readable", function () {
    let record;
    while ((record = parser.read()) !== null) {
      records.push(record);
    }
  });
  await finished(parser);
  return records;
}
