import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const fanFavourites = await db.blog.findMany({
      where: {
        isPublished: true,
      },
      orderBy: { claps: { _count: "desc" } },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        description: true,
        createdAt: true,
        readtime: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return NextResponse.json({ success: { fanFavourites } }, { status: 200 });
  } catch (error: any) {
    let errorMessage = "An error occurred while fetching fan favourite blogs.";
    if (process.env.NODE_ENV === "development" && error instanceof Error) {
      errorMessage += ` Details: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
