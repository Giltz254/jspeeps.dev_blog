"use server";

import { db } from "@/lib/db";
import { getUserId } from "@/lib/userId";
import { revalidateTag } from "next/cache";
export const markNotificationAsRead = async (
  notificationId?: string,
  markAll: boolean = false
) => {
  const userId = await getUserId();

  if (!userId) {
    console.error("markNotificationAsRead: User unauthenticated.");
    return { error: "unauthenticated" };
  }
  try {
    if (markAll) {
      const { count } = await db.notification.updateMany({
        where: {
          recipientId: userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      if (count > 0) {
        console.log(`Marked ${count} notifications as read for user ${userId}.`);
        revalidateTag("notifications");
      } else {
        console.log(`No unread notifications to mark for user ${userId}.`);
      }
      return { success: true, updatedCount: count };
    } else {
      if (!notificationId) {
        console.error("markNotificationAsRead: Notification ID is required for single mark.");
        return { error: "Notification ID is required." };
      }
      const existingNotification = await db.notification.findUnique({
        where: {
          id: notificationId,
          recipientId: userId,
        },
        select: {
          isRead: true,
        },
      });

      if (!existingNotification) {
        console.warn(
          `markNotificationAsRead: Notification ${notificationId} not found or not authorized for user ${userId}.`
        );
        return { error: "Notification not found or not authorized to update." };
      }
      if (existingNotification.isRead) {
        console.log(`Notification ${notificationId} is already marked as read. No action needed.`);
        return { success: true, notificationId, message: "already_read" };
      }
      const notification = await db.notification.update({
        where: {
          id: notificationId,
          recipientId: userId,
        },
        data: {
          isRead: true,
        },
      });

      console.log(`Notification ${notification.id} marked as read for user ${userId}.`);
      revalidateTag("notifications");
      return { success: true, notificationId: notification.id };
    }
  } catch (error) {
    console.error(
      `markNotificationAsRead: Error marking notification(s) as read:`,
      error
    );
    return { error: "Failed to mark notification(s) as read." };
  }
};