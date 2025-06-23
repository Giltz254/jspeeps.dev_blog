import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page } = await params;
  const headersList = await headers();
  const pageNumber = parseInt(page || "1", 10);
  const rawLimit = headersList.get("x-limit");
  const limit = parseInt(rawLimit || "10", 10);
  const skip = (pageNumber - 1) * limit;
  const userId = headersList.get("x-user-id");
   try {
       const whereClause: any = { isPublished: true };
       const blogs = await db.blog.findMany({
         skip,
         take: limit,
         orderBy: {
           createdAt: "desc",
         },
         where: whereClause,
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
       const totalBlogsCount = await db.blog.count({ where: whereClause });
       const hasMore = totalBlogsCount > pageNumber * limit;
       const totalPages = Math.ceil(totalBlogsCount / limit);
       const featuredBlogs = await db.blog.findMany({
         where: {
           isPublished: true,
           featured: true,
         },
         orderBy: {
           createdAt: "desc",
         },
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
       const fanFavourites = await db.blog.findMany({
         where: {
           isPublished: true,
         },
         orderBy: {
           claps: {
             _count: "desc",
           },
         },
         take: 5,
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
               bookmarks: true,
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
   
       return NextResponse.json({
         success: {
           blogs,
           hasMore,
           featuredBlogs,
           fanFavourites,
           totalPages
         },
       });
     } catch (error) {
       return NextResponse.json(
         { error: "Error fetching blogs!" },
         { status: 500 }
       );
     }
}
