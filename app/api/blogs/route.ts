import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const tag = searchParams.get("tag") || undefined;

  const skip = (page - 1) * limit;
  const session = await auth();
  const userId = session?.user.id;

  try {
    const whereClause: any = { isPublished: true };
    if (tag) {
      const formattedTagForDB = tag.replace(/-/g, " ");
      whereClause.tags = {
        has: formattedTagForDB,
      };
    }
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
          where: { userId },
          select: { id: true },
        },
        bookmarks: {
          where: { userId },
          select: { id: true },
        },
      },
    });
    const totalBlogsCount = await db.blog.count({ where: whereClause });
    const hasMore = totalBlogsCount > page * limit;
    const totalPages = Math.ceil(totalBlogsCount / limit);
    const featuredBlogs = await db.blog.findMany({
      where: {
        isPublished: true,
        featured: true,
      },
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
          where: { userId },
          select: { id: true },
        },
        bookmarks: {
          where: { userId },
          select: { id: true },
        },
      },
    });
    const fanFavourites = await db.blog.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        claps: {
          _count: "desc",
        },
      },
      take: 5,
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
            bookmarks: true,
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
    });

    return NextResponse.json({
      success: {
        blogs,
        hasMore,
        featuredBlogs,
        fanFavourites,
        totalPages
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching blogs!" },
      { status: 500 }
    );
  }
}
