import { fetchTags } from "@/actions/blogs/fetch-tags";
import CreateBlogPost from "@/components/custom/blog/CreateBlogPost";
import { getUserId } from "@/lib/userId";
import React from "react";

const page = async () => {
  const blogTags = await fetchTags();
  if (!Array.isArray(blogTags)) {
    return [];
  }
  const userId = await getUserId();
  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-neutral-50">
      <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8">
        <CreateBlogPost availableTags={blogTags} userId={userId} />
      </div>
    </div>
  );
};

export default page;
