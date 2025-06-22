'use server'

import { db } from "@/lib/db"
import { revalidateTag } from "next/cache";

export async function updateBlogFeatured(id: string, featured: boolean) {
  try {
    const blog = await db.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return { error: "Blog not found." };
    }

    if (featured) {
      const featuredCount = await db.blog.count({
        where: { featured: true },
      });

      if (featuredCount >= 6) {
        return {
          error: "Maximum of 6 featured posts allowed. Unmark one to add another.",
        };
      }
    }

    await db.blog.update({
      where: { id },
      data: { featured },
    });
    revalidateTag("blogs");
    return { success: "Blog updated successfully." };
  } catch (error) {
    console.error("Error updating blog featured status:", error);
    return {
      error: "Something went wrong. Please retry.",
    };
  }
}
