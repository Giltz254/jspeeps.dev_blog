export const getBlogByIdOrSlug = async ({
  id,
  slug,
  userId,
}: {
  id?: string;
  slug?: string;
  userId: string | null;
}) => {
  if (!id && !slug) {
    return { error: "Either 'id' or 'slug' must be provided." };
  }
  const url = id
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/_?id=${id}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(id ? { "x-blog-id": id } : {}),
      ...(userId ? { "x-user-id": userId } : {}),
    },
    cache: id ? "no-store" : "force-cache",
    next: {
      tags: ["blogs"],
    },
  });

  if (!res.ok) {
    return { error: "Blog fetch failed" };
  }
  const data = await res.json();
  return {
    success: {
      blog: data.blog,
      relatedBlogs: data.relatedBlogs
    },
  };
};
