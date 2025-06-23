import { getPublishedBlogs } from "@/app/(home)/(blog)/blog/feed/[page]/page";
import Card from "@/components/custom/blog/Card";
import ListBlog, { BlogWithUser } from "@/components/custom/blog/ListBlog";
import SectionHeader from "@/components/custom/blog/SectionHeader";
import Alert from "@/components/custom/forms/Alert";
import { getUserId } from "@/lib/userId";
import { Sparkles, Star } from "lucide-react";

const getPublishedBlogsByTags = async ({
  page = 1,
  limit = 10,
  tag,
  userId
}: {
  tag: string;
  limit: number;
  page: number;
  userId: string | null;
}) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/tags/${tag}/${page}`,
      {
        headers: {
          "x-limit": String(limit),
          ...(userId ? { "x-user-id": userId } : {}),
          "Content-Type": "application/json",
        },
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
const tagPage = async ({
  params,
}: {
  params: Promise<{ page: string; tag: string }>;
}) => {
  const { page, tag } = await params;
  const currentPage = parseInt(page ?? "1", 10);
  const limit: number = 10;
  const userId = await getUserId();
  const { success, error } = await getPublishedBlogsByTags({
    page: currentPage,
    limit,
    tag,
    userId
  });
  const result = await getPublishedBlogs({
    page: currentPage,
    limit,
    userId
  });
  if (error || result.error) {
    return <Alert error message="Error fetching blogs" />;
  }
  if (!success || !result.success) {
    return (
      <div className="max-w-xl mx-auto">
        <Alert error message="No Posts" />;
      </div>
    );
  }
  const { featuredBlogs, fanFavourites } = result.success;
  const { blogs, hasMore } = success;
  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex-1 pb-10 lg:border-r lg:border-border">
        <ListBlog
          tag={tag}
          blogs={blogs}
          hasMore={hasMore}
          currentPage={currentPage}
        />
      </div>
      <div className="lg:w-1/3 w-full lg:min-h-[calc(100vh-64px)]">
          {featuredBlogs.length > 0 && (
            <div className="pt-8">
              <SectionHeader
                title="Featured articles"
                icon={Sparkles}
                className="font-[family-name:var(--font-lora)]"
              />
              {featuredBlogs.map((blog: BlogWithUser, index: number) => (
                <Card
                  total={featuredBlogs.length}
                  key={index}
                  blog={blog}
                  index={index}
                />
              ))}
            </div>
          )}
          {fanFavourites.length > 0 && (
            <div className="lg:sticky lg:top-32 lg:h-[calc(100vh-64px)] lg:overflow-y-auto custom-scrollbar pt-8">
              <SectionHeader
                title="Top rated"
                icon={Star}
                className="font-[family-name:var(--font-lora)]"
              />
              {fanFavourites.map((blog: BlogWithUser, index: number) => (
                <Card
                  total={fanFavourites.length}
                  key={index}
                  blog={blog}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
    </div>
  );
};

export default tagPage;
