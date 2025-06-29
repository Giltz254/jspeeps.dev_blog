"use server";
import { db } from "@/lib/db";
import { getUserId } from "@/lib/userId";
import { EntityType, NotificationType } from "@prisma/client";
import { revalidateTag } from "next/cache";
export const createNotification = async ({
  recipientId,
  type,
  blogId,
  commentId,
  entityType,
  content,
}: {
  recipientId: string;
  type: NotificationType;
  entityType?: EntityType;
  content?: string;
  blogId?: string;
  commentId?: string;
}) => {
  const userId = await getUserId();
  if (!userId) {
    return { error: "Not authenticated!" };
  }
  if (userId === recipientId) {
    return { error: "Failed to send notification to self!" };
  }
  const recipient = await db.user.findUnique({
    where: { id: recipientId },
  });
  if (!recipient) {
    return { error: "Recipient not found!" };
  }
  try {
    await db.notification.create({
      data: {
        senderId: userId,
        recipientId,
        type,
        blogId,
        commentId,
        entityType,
        content,
      },
    });
    revalidateTag("notifications");
    return { success: "Notification sent!" };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { error: "Failed to send notification!" };
  }
};
