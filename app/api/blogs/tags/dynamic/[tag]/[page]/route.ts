import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tag: string; page: string }> }
) {
  try {
    const { tag, page } = await params;
    if (!tag) {
      return NextResponse.json({ error: "Tag is required." }, { status: 400 });
    }
    const pageNumber = parseInt(page || "1", 10);
    const limit = 10;
    const skip = (pageNumber - 1) * limit;
    const formattedTagForDB = tag.replace(/-/g, " ");
    const headersList = await headers();
    const userId = headersList.get("x-user-id");
    if (!userId) {
      return NextResponse.json({
        success: {
          userInteractions: { clappedByUser: false, bookmarkedByUser: false },
        },
      });
    }

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
      select: {
        id: true,
        claps: {
          where: { userId },
          select: { id: true },
        },
        bookmarks: {
          where: { userId },
          select: { id: true },
        },
      },
    });

    const userInteractions: Record<
      string,
      { clappedByUser: boolean; bookmarkedByUser: boolean }
    > = {};

    for (const blog of blogs) {
      userInteractions[blog.id] = {
        clappedByUser: blog.claps.length > 0,
        bookmarkedByUser: blog.bookmarks.length > 0,
      };
    }
    return NextResponse.json({ success: { userInteractions } });
  } catch (error: any) {
    console.error("Error fetching tag dynamic data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user-specific tag interactions." },
      { status: 500 }
    );
  }
}
