import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { headers } from 'next/headers'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const headersList = await headers()
  const id = headersList.get('x-blog-id')
  const userId = headersList.get('x-user-id');
  if (!id && !slug) {
    return NextResponse.json({ error: "Missing ID or Slug!" }, { status: 400 });
  }
  try {
    const blog = await db.blog.findUnique({
      where: id ? { id } : { slug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            claps: true,
            comments: true,
          },
        },
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

    if (!blog) {
      return NextResponse.json({ error: "Blog not found!" }, { status: 404 });
    }
    const currentBlogTags = blog.tags;
    let relatedBlogs: any[] = [];
    if (currentBlogTags && currentBlogTags.length > 0) {
      relatedBlogs = await db.blog.findMany({
        where: {
          tags: {
            hasSome: currentBlogTags,
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
      });
    }

    return NextResponse.json({ blog, relatedBlogs });
  } catch (error) {
    console.error("Error fetching blog or related articles:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}