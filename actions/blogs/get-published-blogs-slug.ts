export const getPublishedBlogsSlugs = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/slugs`,
      {
        next: { tags: ["blogs"] },
        cache: "force-cache",
      }
    );
    if (!res.ok) {
      return { error: `Failed to fetch blog slugs: ${res.status} ${res.statusText}` };
    }
    const blogs = await res.json();
    if (!Array.isArray(blogs)) {
      return { error: "Invalid data format received from blog slugs API." };
    }
    return blogs.map((blog: { slug: string; updatedAt: Date }) => ({
      slug: blog.slug,
      updatedAt: blog.updatedAt,
    }));
  } catch (error: any) {
    if (error instanceof TypeError) {
      return { error: "Network error fetching blog slugs. Please check your internet connection." };
    }
    return { error: "An unexpected error occurred while fetching blog slugs." };
  }
};