import { db } from "@/lib/db";
export const followers = async ({
  username,
  id,
}: {
  username?: string;
  id?: string;
}) => {
  try {
    if ((username && id) || (!username && !id)) {
      return { error: "Provide either username or id, but not both." };
    }
    const user = await db.user.findUnique({
      where: username ? { username } : { id: id! },
      select: {
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });
    if (!user) {
      return {
        error: `User with ${username ? `username "${username}"` : `ID "${id}"`} not found.`,
      };
    }

    return {
      success: user._count.followers,
    };
  } catch (error) {
    console.error("Error fetching follower count:", error);
    return {
      error: "Failed to retrieve follower count due to an unexpected issue.",
    };
  }
};
