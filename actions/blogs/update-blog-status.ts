"use server";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
export async function updateBlogStatus(id: string, status: boolean) {
  try {
    const blog = await db.blog.findUnique({
      where: {
        id,
      },
    });
    if (!blog) {
      return { error: "Blog not found!" };
    }
    await db.blog.update({
      where: {
        id,
      },
      data: {
        isPublished: status,
      },
    });
    revalidateTag("blogs");
    return { success: "Blog status updated successfully!" };
  } catch (error) {
    return { error: "Something went wrong! please retry." };
  }
}
