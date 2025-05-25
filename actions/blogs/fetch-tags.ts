"use server";
import { db } from "@/lib/db";
export const fetchTags = async (): Promise<string[]> => {
  const blogs = await db.blog.findMany({
    select: { tags: true },
  });
  const allTags = blogs.flatMap((blog) => blog.tags || []);
  const uniqueTags = Array.from(new Set(allTags));
  return uniqueTags;
};
