import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
export async function GET(
  req: Request
) {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");
  const id = headersList.get("x-id");
  console.log("User ID:", userId);
  console.log("Requested User ID:", id);
  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        followers: {
          include: {
            follower: {
              select: {
                id: true,
                name: true,
                image: true,
                followers: {
                  where: { followerId: userId ?? undefined },
                  select: { id: true },
                },
              },
            },
          },
        },
        followings: {
          include: {
            following: {
              select: {
                id: true,
                name: true,
                image: true,
                followers: {
                  where: { followerId: userId ?? undefined },
                  select: { id: true },
                },
              },
            },
          },
        },
        _count: {
          select: {
            followers: true,
            followings: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user follow data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
