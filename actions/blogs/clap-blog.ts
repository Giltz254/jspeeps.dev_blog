"use server";

import { db } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { revalidateTag } from "next/cache";
export const clapBlog = async (blogId: string, userId: string) => {
  const blog = await db.blog.findUnique({
    where: {
      id: blogId,
    },
  });
  if (!blog) {
    return { error: "Blog not found!" };
  }
  const user = await getUserById(userId);
  if (!user) {
    return { error: "User not found!" };
  }
  const clap = await db.clap.findUnique({
    where: {
      userId_blogId: {
        userId,
        blogId,
      },
    },
  });
  if (clap) {
    await db.clap.delete({
      where: {
        id: clap.id,
      },
    });
    revalidateTag("blogs");
    return { success: "Unclapped!" };
  } else {
    await db.clap.create({
      data: {
        userId,
        blogId,
      },
    });
    revalidateTag("blogs")
    return { success: "Clapped!" };
  }
};
