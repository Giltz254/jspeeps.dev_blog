"use server";

import { db } from "@/lib/db";
import { cache } from 'react'

export const getPublishedBlogs = cache(async ({ page = 1, limit = 10, tag }: { tag?: string, limit: number, page: number }) => {
    const skip = (page - 1) * limit;

    try {
        const whereClause: any = {
            isPublished: true,
        };
        if (tag) {
            const formattedTagForDB = tag.replace(/-/g, " ");
            whereClause.tags = {
                has: formattedTagForDB
            };
        }
        const blogs = await db.blog.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc"
            },
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });

        const totalBlogsCount = await db.blog.count({
            where: whereClause
        });

        const hasMore = totalBlogsCount > page * limit;

        return { success: { blogs, hasMore } };
    } catch (error) {
        console.log(error)
        return { error: "Error fetching blogs!" };
    }
});
