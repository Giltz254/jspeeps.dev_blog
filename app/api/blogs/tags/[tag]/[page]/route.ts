import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page: string; tag: string }> }
) {
  const { page, tag } = await params;
  const headersList = await headers();
  const pageNumber = parseInt(page || "1", 10);
  const rawLimit = headersList.get("x-limit");
  const limit = parseInt(rawLimit || "10", 10);
  const skip = (pageNumber - 1) * limit;
  const userId = headersList.get("x-user-id");

  try {
    const formattedTagForDB = tag.replace(/-/g, " ");
    const blogs = await db.blog.findMany({
      where: {
        isPublished: true,
        tags: {
          has: formattedTagForDB,
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
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
          where: userId ? { userId } : undefined,
          select: { id: true },
        },
        bookmarks: {
          where: userId ? { userId } : undefined,
          select: { id: true },
        },
      },
    });
    const totalBlogsCount = await db.blog.count({
      where: {
        isPublished: true,
        tags: {
          has: formattedTagForDB,
        },
      },
    });
    const hasMore = totalBlogsCount > pageNumber * limit;
    return NextResponse.json({ success: { blogs, hasMore } });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching blogs!" },
      { status: 500 }
    );
  }
}
