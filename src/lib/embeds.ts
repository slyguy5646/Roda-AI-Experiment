import OpenAI from "openai";
import { env } from "@/env";
import { prisma } from "./db";
import { Service } from "@prisma/client";

async function embed(text: string | string[]) {
  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response;
}

export async function createEmbedding(text: string) {
  const embedding = await embed(text);

  return embedding.data[0].embedding;
}

export async function createEmbeddings(text: string[]) {
  const embeddings = await embed(text);

  return embeddings.data.map((e) => e.embedding);
}

export async function findClosest(query: string) {
  const embed = await createEmbedding(query);
  const items =
    await prisma.$queryRaw`SELECT "id", "title", "icon", "description" FROM "Service" ORDER BY embedding <-> ${embed}::vector LIMIT 3`;

  return items as Service[];
}
