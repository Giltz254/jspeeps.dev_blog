import { db } from "@/lib/db";
import { getUserId } from "@/lib/userId";
import { NextRequest, NextResponse } from "next/server";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string; page: string }> }
) {
  const { username, page } = await params;
  const pageNumber = parseInt(page || "1", 10);
  const rawLimit = request.headers.get("x-limit");
  const limit = parseInt(rawLimit || "10", 10);
  const skip = (pageNumber - 1) * limit;
  const userId = await getUserId();
  try {
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true, name: true, image: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: `User with username "${username}" not found.` },
        { status: 404 }
      );
    }
    const whereClause = {
      userId: user.id,
      isPublished: true,
    };
    const blogs = await db.blog.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      where: whereClause,
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
    const totalBlogsCount = await db.blog.count({ where: whereClause });
    const hasMore = totalBlogsCount > pageNumber * limit;
    const totalPages = Math.ceil(totalBlogsCount / limit);
    return NextResponse.json({
      success: {
        blogs,
        hasMore,
        totalPages,
        userProfile: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    return NextResponse.json(
      { error: "Something went wrong while fetching user blogs." },
      { status: 500 }
    );
  }
}
