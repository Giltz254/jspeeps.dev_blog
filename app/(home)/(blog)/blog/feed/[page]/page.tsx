import { fetchTags } from "@/actions/blogs/fetch-tags";
import { getPublishedBlogs } from "@/actions/blogs/get-published-blogs";
import CategoryNav from "@/components/custom/blog/CategoryNav";
import ListBlog from "@/components/custom/blog/ListBlog";
import Alert from "@/components/custom/forms/Alert";
import { Metadata } from "next";
import React from "react";
interface BlogFeedProps {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}
export const metadata: Metadata = {
  title:{
    absolute: "The Jspeeps.dev blog"
  },
  description: "JSpeeps.dev blog shares coding tips, JavaScript tricks, and tutorials to boost your frontend and backend skills with modern tools and frameworks."
};
const BlogFeed = async ({ params, searchParams }: BlogFeedProps) => {
  const { page } = await params;
  const tagData = await searchParams;
  const tag = tagData.tag
  const limit: number = 10;
  const currentPage = parseInt(page, 10) || 1;
  const { success, error } = await getPublishedBlogs({
    page: currentPage,
    limit,
    tag
  });
  if (error) {
    return <Alert error message="Error fetching blogs" />;
  }
  if (!success) {
    return (
      <div className="max-w-xl mx-auto">
        <Alert error message="No Posts" />;
      </div>
    )
  }
  const { blogs, hasMore } = success;
  const tags = await fetchTags()
  return (
    <div className="flex flex-col min-h-[calc(10vh-64px)] bg-white w-full">
      <div className="sticky top-16 h-16 w-full border-b z-10">
        <CategoryNav tags={tags} />
      </div>
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex-1 pb-10 lg:border-r lg:border-border">
          <ListBlog blogs={blogs} hasMore={hasMore} currentPage={currentPage} />
        </div>
        <div className="w-1/3">
        
        </div>
      </div>
    </div>
  );
};

export default BlogFeed;