"use server";

import { db } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { CommentSchema, CommentSchemaType } from "@/schemas/CommentSchema";

export const addComment = async ({
  values,
  userId,
  blogId,
  parentId,
  repliedToUserId,
}: {
  values: CommentSchemaType;
  repliedToUserId?: string;
  blogId: string;
  parentId?: string;
  userId?: string;
}) => {
  const vFields = CommentSchema.safeParse(values);
  if (!vFields.success) return { error: "Invalid fields" };
  const { content } = vFields.data;
  if (!userId) return { error: "Log in to comment!" };
  const user = await getUserById(userId);
  if (!user) return { error: "User not found!" };

  const blog = await db.blog.findUnique({ where: { id: blogId } });
  if (!blog) return { error: "Blog not found" };

  if (parentId) {
    const parentComment = await db.comment.findUnique({
      where: { id: parentId },
    });
    if (!parentComment) return { error: "Parent comment not found" };
  }
  if (repliedToUserId) {
    const repliedToUser = await getUserById(repliedToUserId);
    if (!repliedToUser) return { error: "Replied-to user not found!" };
  }
  const newComment = await db.comment.create({
    data: {
      userId,
      blogId,
      parentId: parentId ?? null,
      repliedToUserId,
      content,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      repliedToUser: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          claps: true,
          replies: true,
        },
      },
      claps: true,
    },
  });
  return {
  success: {
    message: "Comment added successfully",
    comment: {
      id: newComment.id,
      blogId: newComment.blogId,
      userId: newComment.userId,
      parentId: newComment.parentId,
      repliedToUserId: newComment.repliedToUserId,
      content: newComment.content,
      createdAt: newComment.createdAt,
      user: newComment.user,
      repliedToUser: newComment.repliedToUser,
      _count: newComment._count,
      claps: newComment.claps,
    },
  },
};
};
