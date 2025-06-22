import { fetchTags } from "@/actions/blogs/fetch-tags";
import CategoryNav from "@/components/custom/blog/CategoryNav";
import React from "react";

const TagLayout = async ({ children }: { children: React.ReactNode }) => {
  const tags = await fetchTags();
  if (!Array.isArray(tags)) {
  return [];
}
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-white w-full">
      <div className="sticky top-16 h-16 w-full border-b z-10 bg-white">
        <CategoryNav tags={tags} />
      </div>
      {children}
    </div>
  );
};

export default TagLayout;
