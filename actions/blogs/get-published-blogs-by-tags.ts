export const getPublishedBlogsByTags = async ({
  page = 1,
  limit = 10,
  tag,
}: {
  tag: string;
  limit: number;
  page: number;
}) => {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  console.log("Second page function>>>>>", page)
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/tags/${tag}?${searchParams.toString()}`,
      {
        next: { tags: ["blogs"] },
        cache: "force-cache",
      }
    );
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || "Unknown error occurred" };
    }
    return { success: data.success };
  } catch (err) {
    return { error: "Network error. Please check your internet connection." };
  }
};
