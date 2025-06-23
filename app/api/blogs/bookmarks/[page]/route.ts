import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page } = await params;
  const headersList = await headers();
  const pageNumber = parseInt(page || "1", 10);
  const rawLimit = headersList.get("x-limit");
  const limit = parseInt(rawLimit || "10", 10);
  const skip = (pageNumber - 1) * limit;
  const userId = headersList.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "User not found!" }, { status: 401 });
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

    const totalBookmarks = await db.bookmark.count({ where: { userId } });
    const hasMore = totalBookmarks > pageNumber * limit;

    return NextResponse.json({ blogs, hasMore }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching bookmarked articles!" },
      { status: 500 }
    );
  }
}
