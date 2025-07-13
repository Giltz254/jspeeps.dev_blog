import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: "Missing Slug!" }, { status: 400 });
  }
  try {
    const blog = await db.blog.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        coverImage: true,
        description: true,
        createdAt: true,
        summary: true,
        readtime: true,
        tags: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        isPublished: true,
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found!" }, { status: 404 });
    }
    const relatedBlogsPromise =
      blog.tags && blog.tags.length > 0
        ? db.blog.findMany({
            where: {
              tags: {
                hasSome: blog.tags,
              },
              id: {
                not: blog.id,
              },
              isPublished: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 6,
            select: {
              id: true,
              slug: true,
              title: true,
              coverImage: true,
              description: true,
              createdAt: true,
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          })
        : Promise.resolve([]);

    const [relatedBlogs] = await Promise.all([relatedBlogsPromise]);

    return NextResponse.json({ blog, relatedBlogs });
  } catch (error) {
    console.error("Error fetching static blog data:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
