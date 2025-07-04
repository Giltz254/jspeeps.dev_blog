import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tag: string; page: string }> }
) {
  try {
    const { tag, page } = await params;
    if (!tag) {
      return NextResponse.json(
        { error: "Tag parameter is required." },
        { status: 400 }
      );
    }
    const pageNumber = parseInt(page || "1", 10);
    const limit = 10;
    const skip = (pageNumber - 1) * limit;
    const formattedTagForDB = tag.replace(/-/g, " ");
    const [blogs, totalBlogsCount] = await Promise.all([
      db.blog.findMany({
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
          title: true,
          description: true,
          coverImage: true,
          slug: true,
          readtime: true,
          createdAt: true,
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
        },
      }),
      db.blog.count({
        where: {
          isPublished: true,
          tags: {
            has: formattedTagForDB,
          },
        },
      }),
    ]);
    const hasMore = totalBlogsCount > pageNumber * limit;
    return NextResponse.json({
      success: {
        blogs,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching blogs by tag:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs by tag." },
      { status: 500 }
    );
  }
}
