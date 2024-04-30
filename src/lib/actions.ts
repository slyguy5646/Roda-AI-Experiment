"use server";

import { findClosest } from "./embeds";
import z from "zod";

export async function search(formData: FormData) {
  const query = formData.get("query");

  const valid = z.string().min(3).safeParse(query);

  if (!valid.success) return [];

  const closest = await findClosest(valid.data);

  console.log("CLOSEST", closest)

  return closest;
}
