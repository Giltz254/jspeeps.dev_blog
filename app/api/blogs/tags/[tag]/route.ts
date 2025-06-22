import { db } from "@/lib/db";
import { getUserId } from "@/lib/userId";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  const { tag } = await params;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;
  const userId = await getUserId();
  console.log("Second page>>>>>", page)
  try {
    const formattedTagForDB = tag.replace(/-/g, " ");
    const blogs = await db.blog.findMany({
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
    const totalBlogsCount = await db.blog.count({
      where: {
        isPublished: true,
        tags: {
          has: formattedTagForDB,
        },
      },
    });
    const hasMore = totalBlogsCount > page * limit;
    return NextResponse.json({ success: { blogs, hasMore } });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching blogs!" }, { status: 500 });
  }
}
