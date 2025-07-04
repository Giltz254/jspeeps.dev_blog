import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { headers } from "next/headers";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const headersList = await headers();
  const userId = headersList.get("x-user-id");
  if (!slug) {
    return NextResponse.json({ error: "Missing Slug!" }, { status: 400 });
  }
  try {
    const dynamicBlogData = await db.blog.findUnique({
      where: { slug},
      select: {
        id: true,
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

    if (!dynamicBlogData) {
      return NextResponse.json({ error: "Blog not found!" }, { status: 404 });
    }
    const hasClapped = dynamicBlogData.claps.length > 0;
    const hasBookmarked = dynamicBlogData.bookmarks.length > 0;
    return NextResponse.json({
      clapsCount: dynamicBlogData._count.claps,
      commentsCount: dynamicBlogData._count.comments,
      hasClapped,
      hasBookmarked,
    });
  } catch (error) {
    console.error("Error fetching dynamic blog data:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}