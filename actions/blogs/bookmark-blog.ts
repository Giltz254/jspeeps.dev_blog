"use server";

import { db } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { revalidateTag } from "next/cache";

export const bookmarkBlog = async (blogId: string, userId: string) => {
    const blog = await db.blog.findUnique({
        where: {
            id: blogId,
        }
    })
    if (!blog) {
        return { error: "Blog not found!" };
    }
    const user = await getUserById(userId);
    if (!user) {
        return { error: "User not found!" }
    }
    const bookmark = await db.bookmark.findUnique({
        where: {
            userId_blogId: {
                userId, blogId
            }
        }
    })
    if (bookmark) {
        await db.bookmark.delete({
            where: {
                id: bookmark.id
            }
        })
        revalidateTag("blogs")
        return { success: "Bookmark removed!"}
    } else {
        await db.bookmark.create({
            data: {
                userId,
                blogId
            }
        })
        revalidateTag("blogs")
        return { success: "Bookmarked!"}
    }
}