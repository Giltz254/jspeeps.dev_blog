"use server";

import { db } from "@/lib/db";
import { getUserId } from "@/lib/userId";
export const followUser = async ({followingId}: { followingId: string}) => {
    const currentUid = await getUserId()
    const follow = await db.follow.findFirst({
        where: {
            followerId: currentUid ?? undefined,
            followingId: followingId
        }
    })
    return follow
}