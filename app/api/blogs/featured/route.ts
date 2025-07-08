import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    const featuredBlogs = await db.blog.findMany({
      where: { isPublished: true, featured: true },
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json({ success: { featuredBlogs } }, { status: 200 });
  } catch (error: any) {
    let errorMessage = "An error occurred while fetching featured blogs.";
    if (process.env.NODE_ENV === "development" && error instanceof Error) {
      errorMessage += ` Details: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
