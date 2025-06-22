import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const searchParams = req.nextUrl.searchParams;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  const session = await auth();
  const userId = session?.user?.id;

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
    const hasMore = totalBlogsCount > page * limit;
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
