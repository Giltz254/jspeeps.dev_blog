"use server";

import { db } from "@/lib/db";
import { getUserId } from "@/lib/userId";

export const deleteComment = async (commentId: string) => {
  const userId = await getUserId();
  const comment = await db.comment.findUnique({ where: { id: commentId } });
  if (!comment) return { error: "comment not found" };
  if (comment.userId !== userId) return { error: "unauthorized!" };
  await db.commentClap.deleteMany({
    where: {
      comment: {
        parentId: commentId,
      },
    },
  });
  await db.comment.deleteMany({
    where: {
      parentId: commentId,
    },
  });
  await db.commentClap.deleteMany({
    where: {
      commentId,
    },
  });
  await db.comment.delete({
    where: { id: commentId },
  });
  return { success: "comment deleted" };
};
