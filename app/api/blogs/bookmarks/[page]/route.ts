import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page } = await params;
  const headersList = await headers();
  const pageNumber = parseInt(page || "1", 10);
  const rawLimit = headersList.get("x-limit");
  const limit = parseInt(rawLimit || "10", 10);
  const skip = (pageNumber - 1) * limit;
  const userId = headersList.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "User not found!" }, { status: 401 });
  }

  try {
    const [bookmarks, totalBookmarks] = await Promise.all([
      db.bookmark.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        where: { userId },
        select: {
          blog: {
            select: {
              id: true,
              title: true,
              description: true,
              slug: true,
              readtime: true,
              coverImage: true,
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
          },
        },
      }),
      db.bookmark.count({ where: { userId } }),
    ]);

    const blogs = bookmarks
      .filter((bm) => bm.blog !== null)
      .map(({ blog }) => ({
        id: blog.id,
        title: blog.title,
        description: blog.description,
        slug: blog.slug,
        readtime: blog.readtime,
        coverImage: blog.coverImage,
        user: blog.user,
        _count: blog._count,
        clappedByUser: blog.claps.length > 0,
        bookmarkedByUser: blog.bookmarks.length > 0,
      }));

    const hasMore = totalBookmarks > pageNumber * limit;

    return NextResponse.json({ blogs, hasMore }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookmarked blogs:", error);
    return NextResponse.json(
      { error: "Error fetching bookmarked articles!" },
      { status: 500 }
    );
  }
}
