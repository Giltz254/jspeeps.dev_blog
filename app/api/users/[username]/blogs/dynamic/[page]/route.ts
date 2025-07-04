import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

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
    const headersList = await headers();
    const userId = headersList.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { success: null, error: "Unauthorized: Missing user ID header." },
        { status: 401 }
      );
    }
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: null, error: `User '${username}' not found.` },
        { status: 404 }
      );
    }
    const blogs = await db.blog.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      where: {
        userId: user.id,
        isPublished: true,
      },
      select: {
        id: true,
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

    return NextResponse.json({ success: blogs, error: null });
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
