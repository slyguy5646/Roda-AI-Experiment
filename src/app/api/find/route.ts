import { findClosest } from "@/lib/embeds";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const findSchema = z.object({
  query: z.string().min(3),
});

export type FindSchema = z.infer<typeof findSchema>

export async function POST(req: NextRequest) {
  const valid = findSchema.safeParse(await req.json());

  if (!valid.success) return new NextResponse(undefined, { status: 422 });

  const closest = await findClosest(valid.data.query);

  return NextResponse.json({ closest });
}
