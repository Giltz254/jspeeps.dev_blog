import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  try {
    const { tag } = await params;

    if (!tag) {
      return NextResponse.json(
        { error: "Tag parameter is required." },
        { status: 400 }
      );
    }
    const formattedTagForDB = tag.replace(/-/g, " ");
    const limit = 10;
    const totalBlogsCount = await db.blog.count({
      where: {
        isPublished: true,
        tags: {
          has: formattedTagForDB,
        },
      },
    });
    const totalPages = Math.ceil(totalBlogsCount / limit);
    return NextResponse.json({
      success: { totalPages },
    });
  } catch (error) {
    console.error("Error calculating total pages by tag:", error);
    return NextResponse.json(
      { error: "Failed to calculate total pages by tag." },
      { status: 500 }
    );
  }
}
