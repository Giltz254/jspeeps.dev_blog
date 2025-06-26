export const getUserFollowData = async (id: string, userId: string | null) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/follow`, {
      headers: {
        "x-id": id,
        "x-user-id": userId ?? "",
        "Content-Type": "application/json",
      },
      method: "GET",
      cache: "no-store",
      next: {
        tags: ["follow"],
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch user follow data");
    }
    const data = await res.json();
    return data.user;
  } catch (error) {
    console.error("Error fetching user follow data:", error);
    return null;
  }
};
