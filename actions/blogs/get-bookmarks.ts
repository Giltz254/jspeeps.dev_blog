"use server";

import { db } from "@/lib/db";
import { getUserId } from "@/lib/userId";

export const getBookmarks = async ({
  page = 1,
  limit = 10,
}: {
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;
  const userId = await getUserId();
  if (!userId) {
    return { error: "User not found!" };
  }
  try {
    const bookmarks = await db.bookmark.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId,
      },
      include: {
        blog: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            _count: {
              select: {
                claps: true,
                comments: true,
              },
            },
            claps: {
              where: { userId },
              select: { id: true },
            },
            bookmarks: {
              where: { userId },
              select: { id: true },
            },
          },
        },
      },
    });
    const blogs = bookmarks
      .filter((bookmark) => bookmark.blog !== null)
      .map((bookmark) => bookmark.blog);
    const totalbookmarks = await db.bookmark.count({
      where: {
        userId,
      },
    });
    const hasMore = totalbookmarks > page * limit;
    return { success: { blogs, hasMore } };
  } catch (error) {
    return { error: "Error fetching bookmarked articles!" };
  }
};
