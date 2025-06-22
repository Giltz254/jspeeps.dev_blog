export const fetchPaginatedComments = async (
  blogId: string,
  parentId: string | null,
  userId: string | undefined,
  page: number,
  limit = 10
) => {
  const res = await fetch("/api/comments", {
    method: "POST",
    body: JSON.stringify({ blogId, parentId, userId, page, limit }),
    next: {
        tags: ["comments"]
    },
    cache: "no-store"
  });

  if (!res.ok) throw new Error("Failed to fetch comments");

  const data = await res.json();
  if (data.error) throw new Error(data.error);

  return data.success;
};
