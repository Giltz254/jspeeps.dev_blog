import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const blogs = await db.blog.findMany({
      select: { tags: true },
    });
    const allTags = blogs.flatMap((blog) => blog.tags || []);
    const tagSet = new Set<string>();
    for (const tag of allTags) {
      if (tag) {
        tagSet.add(tag.trim().toLowerCase());
      }
    }
    const uniqueTags = Array.from(tagSet).sort((a, b) => a.localeCompare(b));
    return NextResponse.json(uniqueTags);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
