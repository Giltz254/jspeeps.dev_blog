import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const blogs = await db.blog.findMany({
      where: {
        isPublished: true,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const result = blogs.map((blog) => ({
      slug: blog.slug,
      updatedAt: blog.updatedAt,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching published blog slugs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
