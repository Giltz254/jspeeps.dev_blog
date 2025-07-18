import { fetchTags } from "@/actions/blogs/fetch-tags";
import Card from "@/components/custom/blog/Card";
import ListBlog, { BlogWithUser } from "@/components/custom/blog/ListBlog";
import SectionHeader from "@/components/custom/blog/SectionHeader";
import ErrorBlock from "@/components/custom/ErrorBlock";
import NoPublicPosts from "@/components/custom/NoPublicPosts";
import { getUserId } from "@/lib/userId";
import { Sparkles, Star } from "lucide-react";
export async function generateStaticParams() {
  const tags = await fetchTags();
  if (!Array.isArray(tags)) return [];
  return tags.map((rawTag) => ({
    tag: rawTag.replace(/\s+/g, "-"),
    page: "1",
  }));
}
const tagPage = async ({
  params,
}: {
  params: Promise<{ page: string; tag: string }>;
}) => {
  const { page, tag } = await params;
  const currentPage = parseInt(page ?? "1", 10);
  const userId = await getUserId();
  const [staticRes, dynamicRes, featuredData, favouritesData] =
    await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/tags/static/${tag}/${currentPage}`,
        {
          cache: "force-cache",
          next: { tags: ["blogs"] },
        }
      ).then((res) => res.json()),
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/tags/dynamic/${tag}/${currentPage}`,
        {
          headers: { "x-user-id": userId ?? "" },
          cache: "no-store",
          next: { tags: ["blogs"] },
        }
      ).then((res) => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/featured`, {
        cache: "force-cache",
        next: { tags: ["blogs"] },
      }).then((res) => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/fan-favourites`, {
        cache: "force-cache",
        next: { tags: ["blogs"] },
      }).then((res) => res.json()),
    ]);
  const error =
    staticRes?.error ||
    dynamicRes?.error ||
    featuredData?.error ||
    favouritesData?.error ||
    null;
  const blogs = (staticRes?.success?.blogs || []).map((blog: BlogWithUser) => {
    const interaction = dynamicRes?.success?.userInteractions?.[blog.id] || {
      clappedByUser: false,
      bookmarkedByUser: false,
    };
    return {
      ...blog,
      ...interaction,
    };
  });
  const hasMore = staticRes?.success?.hasMore ?? false;
  const featuredBlogs = featuredData?.success?.featuredBlogs ?? [];
  const fanFavourites = favouritesData?.success?.fanFavourites ?? [];
  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex-1 pb-10 lg:border-r lg:border-border">
        {error ? (
          <ErrorBlock title="Unable to load data" message={error} />
        ) : blogs.length === 0 ? (
          <NoPublicPosts />
        ) : (
          <ListBlog
            tag={tag}
            blogs={blogs}
            hasMore={hasMore}
            currentPage={currentPage}
          />
        )}
      </div>
      <div className="lg:w-1/3 w-full lg:min-h-[calc(100vh-64px)]">
        {featuredBlogs.length > 0 && (
          <div className="pt-8">
            <SectionHeader
              title="Featured articles"
              icon={Sparkles}
              className="lg:pl-4"
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
            <SectionHeader className="lg:pl-4" title="Top rated" icon={Star} />
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
