// app/api/notifications/route.ts
import { db } from "@/lib/db";
import { getUserId } from "@/lib/userId";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor"); 
    const limit = parseInt(searchParams.get("limit") || "10", 10); 
    const notifications = await db.notification.findMany({
      where: {
        recipientId: userId,
        isRead: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
        blog: {
          select: {
            id: true,
            title: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            blogId: true,
          },
        },
      },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: {
        createdAt: "desc",
      },
    });

    const hasMore = notifications.length > limit;
    const data = hasMore ? notifications.slice(0, -1) : notifications;
    const nextCursor = hasMore ? data[data.length - 1].id : null;


    // Clean up old notifications (consider moving this to a separate cron job for better performance)
    const count = await db.notification.count({
      where: {
        recipientId: userId,
      },
    });
    if (count > 100) {
      await db.notification.deleteMany({
        where: {
          recipientId: userId,
          createdAt: {
            lt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
        },
      });
    }
    const unreadNotificationsCount = await db.notification.count({
      where: {
        recipientId: userId,
        isRead: false,
      },
    });
    const formattedNotifications = data.map((notification) => {
      let content = "";
      switch (notification.type) {
        case "NEW_COMMENT":
          content = `${notification.sender.name || "Someone"} commented on your blog: ${notification.blog?.title}`;
          break;
        case "COMMENT_REPLY":
          content = `${notification.sender.name || "Someone"} replied to your comment: ${notification.comment?.content}`;
          break;
        case "FOLLOW":
          content = `${notification.sender.name || "Someone"} started following you`;
          break;
        case "NEW_CLAP":
          content = `${notification.sender.name || "Someone"} clapped on your blog: ${notification.blog?.title}`;
          break;
        case "SYSTEM_ALERT":
          content = `System Alert: ${notification.content}`;
          break;
        default:
          content = `${notification.sender.name || "Someone"} sent you a notification`;
          break;
      }
      return {
        ...notification,
        content,
      };
    });

    return NextResponse.json({
      notifications: formattedNotifications,
      unreadCount: unreadNotificationsCount,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}