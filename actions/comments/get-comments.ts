"use server";

import { db } from "@/lib/db";
import { Comment, User } from "@prisma/client";
import { cache } from 'react'
type CommentWithUser = Comment & {
  user: Pick<User, "id" | "name" | "image">;
  repliedToUser: Pick<User, "id" | "name"> | null;
  _count: {
    replies: number;
    claps: number;
  };
  claps: {
    id: string;
  }[];
};

type GetCommentsResponse =
  | {
      success: {
        comments: CommentWithUser[];
        totalCount: number;
        hasMore: boolean;
      };
    }
  | {
      error: string;
    };

export const getComments = cache(async (
  blogId: string,
  parentId: string | null,
  userId?: string,
  page: number = 1,
  limit: number = 10
): Promise<GetCommentsResponse> => {
  const blog = await db.blog.findUnique({ where: { id: blogId } });
  if (!blog) return { error: "blog not found" };

  try {
    const skip = (page - 1) * limit;

    const [comments, totalCount] = await Promise.all([
      db.comment.findMany({
        where: { blogId, parentId },
        orderBy: { createdAt: parentId ? "desc" : "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
          repliedToUser: {
            select: { id: true, name: true },
          },
          _count: {
            select: {
              replies: true,
              claps: true,
            },
          },
          claps: {
            where: { userId },
            select: { id: true },
          },
        },
      }),

      db.comment.count({
        where: { blogId, parentId },
      }),
    ]);

    return {
      success: {
        comments,
        totalCount,
        hasMore: skip + comments.length < totalCount,
      },
    };
  } catch (error) {
    return { error: "Error fetching comments!" };
  }
});
