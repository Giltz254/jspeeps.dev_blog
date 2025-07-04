import { fetchTags } from "@/actions/blogs/fetch-tags";
import Card from "@/components/custom/blog/Card";
import ListBlog, { BlogWithUser } from "@/components/custom/blog/ListBlog";
import SectionHeader from "@/components/custom/blog/SectionHeader";
import ErrorBlock from "@/components/custom/ErrorBlock";
import NoPublicPosts from "@/components/custom/NoPublicPosts";
import { getUserId } from "@/lib/userId";
import { Sparkles, Star } from "lucide-react";
import { db } from "@/lib/db";

export async function generateStaticParams() {
  const tags = await fetchTags();
  if (!Array.isArray(tags)) {
    console.error("Invalid tags format.");
    return [];
  }
  const allParams: { tag: string; page: string }[] = [];
  for (const rawTag of tags) {
    const formattedTag = rawTag.replace(/\s+/g, "-");

    try {
      const totalCount = await db.blog.count({
        where: {
          isPublished: true,
          tags: {
            has: rawTag, 
          },
        },
      });
      const totalPages = Math.ceil(totalCount / 10); 
      for (let i = 1; i <= totalPages; i++) {
        allParams.push({
          tag: formattedTag,
          page: i.toString(),
        });
      }
    } catch (error) {
      console.error(`Failed to get total pages for tag: ${rawTag}`, error);
    }
  }
  console.log("All params:", allParams)
  return allParams;
}

const tagPage = async ({
  params,
}: {
  params: Promise<{ page: string; tag: string }>;
}) => {
  const { page, tag } = await params;
  const currentPage = parseInt(page ?? "1", 10);
  const userId = await getUserId();
  const [staticRes, dynamicRes, staticData] = await Promise.all([
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
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/static/${currentPage}`,
      {
        cache: "force-cache",
        next: { tags: ["blogs"] },
      }
    ).then((res) => res.json()),
  ]);
  const error =
    staticRes?.error || dynamicRes?.error || staticData?.error || null;
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
  const fanFavourites = staticData?.success?.fanFavourites ?? [];
  const featuredBlogs = staticData?.success?.featuredBlogs ?? [];
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
