import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawPageIndex = parseInt(
  searchParams.get("pageIndex") || searchParams.get("page") || "1",
  10
);
const pageIndex = Math.max(rawPageIndex - 1, 0);
  const pageSize = parseInt(
    searchParams.get("pageSize") || searchParams.get("limit") || "10",
    10
  );
  const skip = pageIndex * pageSize;
  try {
    const blogs = await db.blog.findMany({
      skip: skip,
      take: pageSize,
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
      },
    });
    const totalBlogsCount = await db.blog.count();
    return NextResponse.json({
      blogs: blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        author: blog.user.name || "Unknown",
        createdAt: blog.createdAt,
        tags: blog.tags || [],
        featured: blog.featured || false,
        status: blog.isPublished,
        summary: blog.summary || "",
        description: blog.description || "",
        image: blog.coverImage || "",
      })),
      totalCount: totalBlogsCount,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Error fetching blogs!" },
      { status: 500 }
    );
  }
}
