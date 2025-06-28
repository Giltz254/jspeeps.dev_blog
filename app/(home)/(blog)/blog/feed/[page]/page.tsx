import { fetchTags } from "@/actions/blogs/fetch-tags";
import Card from "@/components/custom/blog/Card";
import CategoryNav from "@/components/custom/blog/CategoryNav";
import ListBlog, { BlogWithUser } from "@/components/custom/blog/ListBlog";
import SectionHeader from "@/components/custom/blog/SectionHeader";
import Alert from "@/components/custom/forms/Alert";
import { getUserId } from "@/lib/userId";
import { Sparkles, Star } from "lucide-react";
import { Metadata } from "next";

export const getPublishedBlogs = async ({
  page = 1,
  limit = 10,
  userId
}: {
  limit: number;
  page: number;
  userId: string | null;
}) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/feed/${page}`,
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
interface BlogFeedProps {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}
export const metadata: Metadata = {
  title: {
    absolute: "The Jspeeps blog",
  },
  description:
    "JSpeeps blog shares coding tips, JavaScript tricks, and tutorials to boost your frontend and backend skills with modern tools and frameworks.",
};
const BlogFeed = async ({ params }: BlogFeedProps) => {
  const { page } = await params;
  const limit: number = 10;
  const userId = await getUserId();
  const currentPage = parseInt(page, 20) || 1;
  const { success, error } = await getPublishedBlogs({
    page: currentPage,
    limit,
    userId
  });
  if (error) {
    return <Alert error message="Error fetching blogs" />;
  }
  if (!success) {
    return (
      <div className="max-w-xl mx-auto">
        <Alert error message="No Posts" />;
      </div>
    );
  }
  const { blogs, hasMore, featuredBlogs, fanFavourites } = success;
  const tags = await fetchTags();
  if (!Array.isArray(tags)) {
    return [];
  }
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-white w-full">
      <div className="sticky top-16 h-16 w-full border-b z-10">
        <CategoryNav tags={tags} />
      </div>
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex-1 pb-10 lg:border-r lg:border-border">
          <ListBlog blogs={blogs} hasMore={hasMore} currentPage={currentPage} />
        </div>
        <div className="lg:w-1/3 w-full lg:min-h-[calc(100vh-64px)]">
          {featuredBlogs.length > 0 && (
            <div className="pt-8">
              <SectionHeader
                title="Featured articles"
                icon={Sparkles}
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
    </div>
  );
};

export default BlogFeed;
