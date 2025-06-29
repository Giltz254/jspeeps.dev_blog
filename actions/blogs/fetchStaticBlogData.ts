export async function fetchStaticBlogData(slug: string): Promise<{ blog: any; relatedBlogs: any[] } | null> {
  if (!slug) {
    console.error("fetchStaticBlogData: No slug or ID provided.");
    throw new Error("Missing blog slug or ID for static data fetch.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}/static`, {
        cache: "force-cache",
        next: {
            tags: ["blogs"]
        }
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
      console.error(`fetchStaticBlogData: API request failed for ${slug}:`, errorMessage);
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`fetchStaticBlogData: Error fetching static blog data for ${slug}:`, error);
    throw error;
  }
}
