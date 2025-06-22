import { fetchTags } from "@/actions/blogs/fetch-tags";
import { getPublishedBlogsByTags } from "@/actions/blogs/get-published-blogs-by-tags";
import ListBlog from "@/components/custom/blog/ListBlog";
import Alert from "@/components/custom/forms/Alert";
import { Metadata } from "next";
import React from "react";
interface TagProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{page: string}>
}
export async function generateStaticParams() {
  const tags = await fetchTags();
   if (!Array.isArray(tags)) {
    return [];
  }
  return tags.map((tag: string) => ({
    tag: tag.toLowerCase().replace(/\s+/g, '-'),
  }));
}
const page = async ({ params, searchParams }: TagProps) => {
  const { tag } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page ?? "1", 10);
  const limit: number = 10;
  const { success, error } = await getPublishedBlogsByTags({
    page: currentPage,
    limit,
    tag,
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
  const { blogs, hasMore } = success;
  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex-1 pb-10 lg:border-r lg:border-border">
        <ListBlog tag={tag} blogs={blogs} hasMore={hasMore} currentPage={currentPage} />
      </div>
      <div className="w-1/3"></div>
    </div>
  );
};

export default page;
