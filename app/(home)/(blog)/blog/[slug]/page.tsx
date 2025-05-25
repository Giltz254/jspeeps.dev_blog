import React from "react";
import Image from "next/image";
import { getBlogBySlug } from "@/actions/blogs/get-blog-by-slug";
import Alert from "@/components/custom/forms/Alert";
import { auth } from "@/auth";
import BlogContent from "@/components/custom/blog/BlogContent";
import formatDate, { Block, calculateReadTime, formatTimeFromNow } from "@/lib/utils";
import Reactions from "@/components/custom/blog/Reactions";
import Toc from "@/components/custom/blog/TableOfContents";
import { Metadata } from "next";
import { getPublishedBlogsSlugs } from "@/actions/blogs/get-published-blogs-slug";
import PostMeta from "@/components/custom/blog/PostMeta";
interface BlogContentProps {
  params: Promise<{ slug: string }>;
}
export async function generateMetadata({
  params,
}: BlogContentProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await getBlogBySlug({ slug });

  if (!res.success || !res.success.blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog could not be found.",
    };
  }

  const blog = res.success.blog;

  return {
    title: {
      absolute: blog.title ?? "Untitled Blog",
    },
    description: blog.description ?? "Read the latest blog on JSpeeps.dev.",
    openGraph: {
      images: [
        {
          url: blog.coverImage ?? `${process.env.BASE_URL}/opengraph-image.png`,
        },
      ],
    },
  };
}
export async function generateStaticParams() {
  const slugsWithDate = await getPublishedBlogsSlugs();
  if (!slugsWithDate || slugsWithDate.length === 0) {
    return [];
  }
  return slugsWithDate.map(({ slug }) => ({ slug }));
}
const page = async ({ params }: BlogContentProps) => {
  const session = await auth();
  const { slug } = await params;
  let readTime = "0 min read";
  const res = await getBlogBySlug({ slug });
  if (!res.success) {
    return (
      <div className="max-w-md mx-auto">
        <Alert error message="Error fetching blog content!" />
      </div>
    );
  }
  const blog = res.success.blog;
  if (!blog) {
    return <Alert error message="No blog post found!" />;
  }
  if (Array.isArray(blog.content)) {
  const blocks = blog.content as Block[];
  readTime = calculateReadTime(blocks);
}
  return (
    <main className="max-w-5xl mx-auto px-4 pt-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-snug">
        {blog.title}
      </h1>
      <p className="text-lg text-gray-700 mb-6">{blog.description}</p>
      {blog.user && blog.user.name && blog.user.image && blog.createdAt && (
        <PostMeta
          author={blog.user.name}
          avatar={blog.user.image}
          readTime={readTime}
          date={formatDate(blog.createdAt)}
        />
      )}

      <Reactions
        author={blog.user.id}
        isSingleBlogPage={true}
        userId={session?.user.id}
        slug={slug}
      />
      {blog.coverImage && (
        <div className="w-full h-64 lg:h-96 relative overflow-hidden shadow-md">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      )}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        <div className="flex-1 lg:border-r lg:border-t border-border py-6">
          <article className="lg:pr-4 content">
            {Array.isArray(blog.content) &&
              blog.content.map((blogItem, i) => (
                <div key={i} className="my-4 md:my-8">
                  <BlogContent blog={blogItem} />
                </div>
              ))}
          </article>
        </div>
        <aside className="w-full lg:w-1/3 py-6 flex flex-col lg:sticky lg:h-[calc(100vh-64px)] lg:overflow-y-clip hover:lg:overflow-y-scroll lg:px-4 lg:top-16 gap-6 lg:transition-all lg:duration-500">
          <Toc selector=".content" />
        </aside>
      </div>
    </main>
  );
};

export default page;
