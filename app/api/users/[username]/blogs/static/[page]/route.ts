import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string; page: string }> }
) {
  try {
    const { username, page } = await params;
    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { success: null, error: "Invalid or missing username." },
        { status: 400 }
      );
    }
    const pageNumber = parseInt(page || "1", 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
      return NextResponse.json(
        { success: null, error: "Invalid page number." },
        { status: 400 }
      );
    }
    const limit = 10;
    const skip = (pageNumber - 1) * limit;
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true, name: true, image: true },
    });
    if (!user) {
      return NextResponse.json(
        { success: null, error: `User '${username}' not found.` },
        { status: 404 }
      );
    }
    const whereClause = {
      userId: user.id,
      isPublished: true,
    };
    const [blogs, totalCount] = await Promise.all([
      db.blog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        where: whereClause,
        select: {
          id: true,
          slug: true,
          title: true,
          coverImage: true,
          readtime: true,
          createdAt: true,
          description: true,
          user: {
            select: {
              name: true,
              id: true,
              image: true,
            },
          },
          _count: {
            select: { claps: true, comments: true },
          },
        },
      }),
      db.blog.count({ where: whereClause }),
    ]);

    const hasMore = totalCount > pageNumber * limit;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: {
        userProfile: user,
        blogs,
        hasMore,
        totalPages,
      },
      error: null,
    });
  } catch (err: any) {
    let errorMessage = "An unexpected error occurred.";
    if (err instanceof Error) {
      errorMessage = `Error: ${err.message}`;
    } else if (typeof err === "string") {
      errorMessage = err;
    } else {
      try {
        errorMessage = JSON.stringify(err);
      } catch {
        errorMessage = "Unknown server error.";
      }
    }
    return NextResponse.json(
      { success: null, error: errorMessage },
      { status: 500 }
    );
  }
}
