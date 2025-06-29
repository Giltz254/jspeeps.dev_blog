export async function fetchDynamicBlogData(slug: string): Promise<any> {
  if (!slug) {
    throw new Error("Missing blog slug or ID for dynamic data fetch.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}/dynamic`, {
        cache: "force-cache",
        next: {
            tags: ["blogs"]
        }
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error(`fetchDynamicBlogData: Error fetching dynamic blog data for ${slug}:`, error);
    throw error;
  }
}
