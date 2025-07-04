import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  try {
    const limit = 10;
    const totalBlogsCount = await db.blog.count({
      where: { isPublished: true },
    });
    const totalPages = Math.ceil(totalBlogsCount / limit);
    return NextResponse.json({ success: { totalPages } });
  } catch (error: any) {
    let errorMessage = "Error calculating total pages.";
    if (process.env.NODE_ENV === "development" && error instanceof Error) {
      errorMessage += ` Details: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
