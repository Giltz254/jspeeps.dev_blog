import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const headersList = await headers();
    const userId = headersList.get("x-user-id");
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

    const blogs = await db.blog.findMany({
      skip,
      take: limit,
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
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
    return NextResponse.json({ success: blogs });
  } catch (err: any) {
    let message = "Unexpected error occurred while fetching blog data.";
    if (process.env.NODE_ENV === "development" && err instanceof Error) {
      message += ` Reason: ${err.message}`;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
