export const fetchTags = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/tags`, {
      next: { tags: ["blogs"] },
      cache: "force-cache",
    });

    if (!res.ok) {
      return { error: `Failed to fetch tags. Status: ${res.status}` };
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return { error: "Invalid tags response format" };
    }

    return data;
  } catch (error) {
    return { error: "Unexpected error while fetching tags" };
  }
};
