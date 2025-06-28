import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 60,
      interval: 10,
      capacity: 120,
    }),
  ],
});

export async function GET(request: NextRequest) {
  const decision = await aj.protect(request, { requested: 5 });
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json(
        { error: "Too Many Requests", reason: decision.reason },
        { status: 429 }
      );
    } else if (decision.reason.isBot()) {
      return NextResponse.json(
        { error: "No bots allowed", reason: decision.reason },
        { status: 403 }
      );
    } else {
      return NextResponse.json(
        { error: "Forbidden", reason: decision.reason },
        { status: 403 }
      );
    }
  }
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("query")?.trim() || "";
    const query = rawQuery.toLowerCase().replace(/\s+/g, "");
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 50);
    const skip = (page - 1) * limit;
    if (!query) {
      return NextResponse.json({
        success: {
          blogs: [],
          hasMore: false,
          totalCount: 0,
        },
      });
    }
    const whereClause: Prisma.BlogWhereInput = {
      isPublished: true,
      OR: [
        { title: { contains: rawQuery, mode: Prisma.QueryMode.insensitive } },
        {
          description: {
            contains: rawQuery,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        { summary: { contains: rawQuery, mode: Prisma.QueryMode.insensitive } },
        { searchText: { contains: query } },
      ],
    };

    const [blogs, totalCount] = await Promise.all([
      db.blog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        where: whereClause,
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          coverImage: true,
          createdAt: true,
          _count: {
            select: {
              claps: true,
              comments: true,
            },
          },
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      }),
      db.blog.count({ where: whereClause }),
    ]);

    const hasMore = totalCount > page * limit;

    return NextResponse.json({
      success: {
        blogs,
        hasMore,
        totalCount,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results." },
      { status: 500 }
    );
  }
}
