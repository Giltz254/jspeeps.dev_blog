import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserId } from "@/lib/userId";
import { UserRole } from "@prisma/client";

export async function GET(
  req: NextRequest
) {
  const id = req.nextUrl.searchParams.get('id');
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized! Please log in." },
      { status: 401 }
    );
  }

  if (!id) {
    return NextResponse.json({ error: "Missing blog ID in search parameters!" }, { status: 400 });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const blog = await db.blog.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        summary: true,
        coverImage: true,
        content: true,
        tags: true,
        userId: true,
        readtime: true,
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found!" }, { status: 404 });
    }
    const isAllowedToFetchForEditing =
      user.role === UserRole.ADMIN || blog.userId === userId;

    if (!isAllowedToFetchForEditing) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You do not have permission to view this blog for editing.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Something went wrong while fetching the blog!" },
      { status: 500 }
    );
  }
}