"use server";

import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

export const deleteBlog = async (id: string) => {
  if (!id) {
    return { error: "Id is required for the blog to be deleted!" };
  }
  try {
    const blog = await db.blog.findUnique({
      where: {
        id
      }
    })
    if (!blog) {
      return { error: "Blog not found!" };
    }
    await db.blog.delete({
      where: {
        id,
      },
    });
    revalidateTag("blogs")
    return { success: "Blog deleted successfully" };
  } catch (error) {
    return {
      error: "Something went wrong while deleting the blog. Please retry!",
    };
  }
};
