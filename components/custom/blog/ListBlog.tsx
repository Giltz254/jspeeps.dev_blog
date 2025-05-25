import React from "react";
import Link from "next/link";
import { Blog, User } from "@prisma/client";
import BlogCard from "./BlogCard";
import Pagination from "./Pagination";
export type BlogWithUser = Blog & {
  user: Pick<User, "id" | "name" | "image">;
};
interface BlogCardProps {
  blogs: BlogWithUser[];
  hasMore: boolean;
  currentPage: number;
  isUserProfile?: boolean;
}
const ListBlog = ({
  blogs,
  hasMore,
  currentPage,
  isUserProfile,
}: BlogCardProps) => {
  return (
    <div className="flex flex-col">
      <section className="">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} isUserProfile={isUserProfile} />
        ))}
      </section>
      <Pagination hasMore={hasMore} currentPage={currentPage} />
    </div>
  );
};

export default ListBlog;
