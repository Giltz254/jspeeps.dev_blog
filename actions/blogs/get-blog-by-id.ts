export const getBlogById = async ({
  id
}: {
  id: string;
}) => {
  if (!id) {
    return { error: "Id must be provided." };
  }
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/id?id=${id}`
  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    return { error: "Blog fetch failed" };
  }
  const data = await res.json();
  return {
    success: {
      blog: data.blog,
    },
  };
};
