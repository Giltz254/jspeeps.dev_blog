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

  const baseSelect = {
    id: true,
    title: true,
    slug: true,
    description: true,
    coverImage: true,
    createdAt: true,
    content: true,
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
      select: {
        id: true,
      },
    },
    bookmarks: {
      where: userId ? { userId } : undefined,
      select: {
        id: true,
      },
    },
  };

  try {
    const whereClause: any = { isPublished: true };
    const [blogs, totalBlogsCount, featuredBlogs, fanFavourites] =
      await Promise.all([
        db.blog.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          where: whereClause,
          select: baseSelect,
        }),

        db.blog.count({ where: whereClause }),

        db.blog.findMany({
          where: {
            isPublished: true,
            featured: true,
          },
          orderBy: { createdAt: "desc" },
          select: baseSelect,
        }),

        db.blog.findMany({
          where: { isPublished: true },
          orderBy: {
            claps: {
              _count: "desc",
            },
          },
          take: 5,
          select: {
            ...baseSelect,
            _count: {
              select: {
                claps: true,
                comments: true,
                bookmarks: true,
              },
            },
          },
        }),
      ]);

    const hasMore = totalBlogsCount > pageNumber * limit;
    const totalPages = Math.ceil(totalBlogsCount / limit);

    return NextResponse.json({
      success: {
        blogs,
        hasMore,
        featuredBlogs,
        fanFavourites,
        totalPages,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching blogs!" },
      { status: 500 }
    );
  }
}
