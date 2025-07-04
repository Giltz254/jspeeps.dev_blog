import { Suspense } from "react";
import Image from "next/image";
import Alert from "@/components/custom/forms/Alert";
import BlogContent from "@/components/custom/blog/BlogContent";
import { Block, calculateReadTime } from "@/lib/utils";
import { Metadata } from "next";
import { getPublishedBlogsSlugs } from "@/actions/blogs/get-published-blogs-slug";
import PostMeta from "@/components/custom/blog/PostMeta";
import { getUserId } from "@/lib/userId";
const Comments = dynamic(() => import("@/components/custom/comments/Comments"));
const Toc = dynamic(() => import("@/components/custom/blog/TableOfContents"));
const Reactions = dynamic(() => import("@/components/custom/blog/Reactions"));
import { HiLightBulb } from "react-icons/hi";
import CommentsLoader from "@/components/custom/comments/CommentsLoader";
import dynamic from "next/dynamic";
const ArticleCard = dynamic(
  () => import("@/components/custom/blog/ArtcleCard")
);
interface BlogContentProps {
  params: Promise<{ slug: string }>;
}
export type BlogPreview = {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  description: string;
  createdAt: Date;
  user: {
    name: string;
    image: string;
  };
};

type BlogSlug = {
  slug: string;
  updatedAt: Date;
};
export async function generateMetadata({
  params,
}: BlogContentProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}/static`,
    {
      cache: "force-cache",
      next: {
        tags: ["blogs"],
      },
    }
  );
  const data = await res.json();
  if (!data || !data.blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog could not be found.",
    };
  }
  const blog = data.blog;
  return {
    title: {
      absolute: blog.title ?? "Untitled Blog",
    },
    description: blog.description ?? "Read the latest blog on JSpeeps.dev.",
    openGraph: {
      images: [
        {
          url:
            blog.coverImage ??
            `${process.env.NEXT_PUBLIC_BASE_URL}/opengraph-image.png`,
        },
      ],
    },
  };
}
export async function generateStaticParams() {
  const result = await getPublishedBlogsSlugs();
  if (result && typeof result === "object" && "error" in result) {
    console.error(
      "Error fetching published blog slugs for static params:",
      result.error
    );
    return [];
  }
  const slugsWithDate: BlogSlug[] = result as BlogSlug[];
  if (!slugsWithDate || slugsWithDate.length === 0) {
    return [];
  }
  return slugsWithDate.map(({ slug }) => ({ slug }));
}
const page = async ({ params }: BlogContentProps) => {
  const { slug } = await params;
  const userId = await getUserId();
  let readTime = "0 min read";
  const [staticData, dynamicData] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}/static`, {
      cache: "force-cache",
      next: {
        tags: ["blogs"],
      },
    }).then((res) => res.json()),

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}/dynamic`, {
      headers: { "x-user-id": userId ?? "" },
      cache: "no-store",
      next: {
        tags: ["blogs"],
      },
    }).then((res) => res.json()),
  ]);
  const { blog, relatedBlogs } = staticData;
  if (!blog) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 h-[calc(100vh-64px)] flex items-center justify-center w-full mt-10">
        {" "}
        <Alert error message="No blog post found!" showRedirectLink />
      </div>
    );
  }
  if (Array.isArray(blog.content)) {
    const blocks = blog.content as Block[];
    readTime = calculateReadTime(blocks);
  }
  return (
    <main className="max-w-6xl mx-auto px-4 pt-10">
      <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-black">
        {blog.title}
      </h1>
      <p className="text-lg text-gray-700 mb-6 pt-4">{blog.description}</p>
      {blog.user && blog.user.name && blog.user.image && blog.createdAt && (
        <PostMeta
          author={blog.user.name}
          avatar={blog.user.image}
          readTime={readTime}
          date={blog.createdAt}
        />
      )}

      <Suspense fallback={<p>Loading reactions...</p>}>
        <Reactions
          isSingleBlogPage={true}
          blogId={blog.id}
          claps={dynamicData.clapsCount}
          Clapped={dynamicData.hasClapped}
          userId={userId}
          author={blog.user.id}
          bookmarked={dynamicData.hasBookmarked}
          comments={dynamicData.commentsCount}
          slug={slug}
        />
      </Suspense>
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        <div className="flex-1 lg:border-r lg:pr-4 pt-4 border-border">
          {blog.coverImage && (
            <div className="w-full h-72 sm:h-96 relative overflow-hidden shadow-md">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover object-center"
                priority={true}
                sizes="(max-width: 1024px) 100vw, (min-width: 1024px) 60vw, 60vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent px-6 py-4">
                <div className="flex flex-col gap-3">
                  <h1 className="text-white font-semibold text-lg md:text-2xl lg:text-3xl leading-snug">
                    {blog.title}
                  </h1>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.slice(0, 3).map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-white/20 text-white text-xs md:text-sm px-3 py-1 rounded-full backdrop-blur-sm border border-white/30"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {blog.summary && (
            <div className="relative p-4 border-2 border-sky-400 bg-sky-50 text-sky-900 mt-8 w-full rounded-lg shadow-sm">
              <span className="absolute rounded-t-lg -top-3 left-4 bg-sky-50 px-3 py-0.5 text-sm text-sky-700 font-semibold flex items-center gap-1">
                <HiLightBulb className="text-sky-500" />
                Blog Summary
              </span>
              <p className="w-full text-base font-normal text-sky-900">
                {blog.summary}
              </p>
            </div>
          )}
          <article className="lg:pl-4 content">
            {Array.isArray(blog.content) &&
              blog.content.map((blogItem: any, i: number) => (
                <div key={i} className="my-4 md:my-8">
                  <BlogContent blog={blogItem} />
                </div>
              ))}
          </article>
          <Suspense fallback={<CommentsLoader text="Loading comments..." />}>
            <Comments
              userId={userId ?? undefined}
              blogId={blog.id}
              creatorId={blog.userId}
            />
          </Suspense>
        </div>
        <aside className="w-full lg:w-1/3 pb-6 pt-4 flex flex-col lg:sticky lg:h-[calc(100vh-64px)] lg:overflow-y-clip hover:lg:overflow-y-scroll lg:px-4 lg:top-16 gap-6 lg:transition-all lg:duration-500">
          <div className="">
            <Toc selector=".content" />
          </div>
        </aside>
      </div>
      <div className="border-t border-t-border flex flex-col py-10">
        <div className="flex flex-col mt-4">
          <Suspense
            fallback={<CommentsLoader text="Loading related articles..." />}
          >
            {relatedBlogs && relatedBlogs.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold text-black mb-10">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                  {relatedBlogs.map((blog: BlogPreview) => (
                    <ArticleCard blog={blog} key={blog.id} />
                  ))}
                </div>
              </>
            )}
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default page;
