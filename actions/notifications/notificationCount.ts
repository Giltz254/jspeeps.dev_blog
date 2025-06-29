"use server";
import { db } from "@/lib/db";
import { getUserId } from "@/lib/userId";

export const getNotificationCount = async () => {
  const userId = await getUserId();
  if (!userId) {
    return { error: "unauthenticated" };
  }
  try {
    const count = await db.notification.count({
      where: {
        recipientId: userId,
        isRead: false,
      },
    });
    return { count };
  } catch (error) {
    console.error("Error fetching notification count:", error);
    return { error: "Failed to fetch notification count" };
  }
}