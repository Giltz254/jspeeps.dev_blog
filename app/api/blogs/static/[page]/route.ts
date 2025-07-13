import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await params;

    if (!page || isNaN(parseInt(page))) {
      return NextResponse.json(
        { error: "Invalid or missing page parameter." },
        { status: 400 }
      );
    }
    const pageNumber = parseInt(page || "1", 10);
    const limit = 20;
    const skip = (pageNumber - 1) * limit;
    const whereClause = { isPublished: true };
    const [blogs, totalBlogsCount] =
      await Promise.all([
        db.blog.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          where: whereClause,
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            coverImage: true,
            createdAt: true,
            readtime: true,
            user: {
              select: { id: true, name: true, image: true },
            },
            _count: {
              select: {
                claps: true,
                comments: true,
                bookmarks: true,
              },
            },
          },
        }),

        db.blog.count({ where: whereClause }),
      ]);

    const hasMore = totalBlogsCount > pageNumber * limit;
    const totalPages = Math.ceil(totalBlogsCount / limit);
    return NextResponse.json({
      success: {
        blogs,
        hasMore,
        totalPages,
      },
    });
  } catch (error: any) {
    let errorMessage = "An error occurred while fetching static blog data.";
    if (process.env.NODE_ENV === "development" && error instanceof Error) {
      errorMessage += ` Details: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
