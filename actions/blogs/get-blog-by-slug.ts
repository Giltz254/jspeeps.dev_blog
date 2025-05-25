"use server";

import { db } from "@/lib/db";

export const getBlogBySlug = async ({slug}: {slug: string }) => {
    if (!slug) {
        return { error: "Missing Slug!"}
    }
    try {
        const blog = await db.blog.findUnique({
            where: {
                slug
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                }
            }
        })
        return { success: { blog }}
    } catch (error) {
        return { error: "Something went wrong! Please try again"}
    }
}