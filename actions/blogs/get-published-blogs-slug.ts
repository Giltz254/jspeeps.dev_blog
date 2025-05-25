"use server";

import { db } from "@/lib/db";

export const getPublishedBlogsSlugs = async () => {
  try {
    const blogs = await db.blog.findMany({
      where: {
        isPublished: true,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    });
    return blogs.map((blog) => ({
      slug: blog.slug,
      updatedAt: blog.updatedAt
    }));
  } catch (error) {
    console.log(error)
    return [];
  }
};
