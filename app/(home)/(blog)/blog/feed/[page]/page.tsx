import { fetchTags } from "@/actions/blogs/fetch-tags";
import Card from "@/components/custom/blog/Card";
import CategoryNav from "@/components/custom/blog/CategoryNav";
import ListBlog, { BlogWithUser } from "@/components/custom/blog/ListBlog";
import PageReload from "@/components/custom/blog/PageReload";
import SectionHeader from "@/components/custom/blog/SectionHeader";
import NoPublicPosts from "@/components/custom/NoPublicPosts";
import { getUserId } from "@/lib/userId";
import { Sparkles, Star } from "lucide-react";
import { Metadata } from "next";
export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/total-pages`,
      {
        cache: "force-cache",
        next: {
          tags: ["blogs"],
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch total pages: ${res.statusText}`);
    }
    const data = await res.json();
    const totalPages = data?.success?.totalPages ?? 1;
    const params = Array.from({ length: totalPages }, (_, i) => ({
      page: (i + 1).toString(),
    }));
    return params;
  } catch (error) {
    const fallback = [{ page: "1" }];
    return fallback;
  }
}
interface BlogFeedProps {
  params: Promise<{ page: string }>;
}
export const metadata: Metadata = {
  title: {
    absolute: "The Jspeeps blog",
  },
  description:
    "JSpeeps blog shares coding tips, JavaScript tricks, and tutorials to boost your frontend and backend skills with modern tools and frameworks.",
};

type DynamicBlogInfo = {
  id: string;
  claps: { id: string }[];
  bookmarks: { id: string }[];
};

type StaticBlog = {
  id: string;
  [key: string]: any;
};

const BlogFeed = async ({ params }: BlogFeedProps) => {
  const { page } = await params;
  const userId = await getUserId();
  const currentPage = parseInt(page, 10) || 1;
  const [staticRes, dynamicRes, tags] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/static/${currentPage}`,
      {
        next: { tags: ["blogs"] },
        cache: "force-cache",
      }
    ).then((res) => res.json()),
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/dynamic/${currentPage}`,
      {
        headers: { "x-user-id": userId ?? "" },
        cache: "no-store",
        next: { tags: ["blogs"] },
      }
    ).then((res) => res.json()),
    fetchTags(),
  ]);
  const staticError = staticRes?.error;
  const dynamicError = dynamicRes?.error;
  const combinedError = staticError || dynamicError;
  if (!Array.isArray(tags)) {
    return [];
  }
  const dynamicSuccess: DynamicBlogInfo[] = Array.isArray(dynamicRes.success)
    ? dynamicRes.success
    : [];

  const dynamicMap = new Map<string, DynamicBlogInfo>(
    dynamicSuccess.map((entry) => [entry.id, entry])
  );

  const posts = Array.isArray(staticRes.success?.blogs)
    ? staticRes.success.blogs.map((post: StaticBlog) => {
        const dynamic = dynamicMap.get(post.id);
        return {
          ...post,
          clappedByUser: (dynamic?.claps?.length || 0) > 0,
          bookmarkedByUser: (dynamic?.bookmarks?.length || 0) > 0,
        };
      })
    : [];

  const hasMore = staticRes.success?.hasMore ?? false;
  const fanFavourites = staticRes.success?.fanFavourites ?? [];
  const featuredBlogs = staticRes.success?.featuredBlogs ?? [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-white w-full">
      <div className="sticky top-16 h-16 w-full border-b z-10">
        <CategoryNav tags={tags} />
      </div>
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex-1 pb-10 lg:border-r lg:border-border">
          {combinedError ? (
            <div className="w-full flex flex-col items-center justify-center py-12 text-center px-4">
              <h2 className="text-xl font-bold text-red-600">
                Failed to load blog posts
              </h2>
              <p className="mt-2 text-gray-700">{combinedError}</p>
              <PageReload />
            </div>
          ) : posts.length === 0 ? (
            <NoPublicPosts />
          ) : (
            <ListBlog
              blogs={posts}
              hasMore={hasMore}
              currentPage={currentPage}
            />
          )}
        </div>

        <div className="lg:w-1/3 w-full lg:min-h-[calc(100vh-64px)]">
          {featuredBlogs.length > 0 && (
            <div className="pt-8">
              <SectionHeader
                className="lg:pl-4"
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
                className="lg:pl-4"
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
