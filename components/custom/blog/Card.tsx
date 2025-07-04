import React from "react";
import { BlogWithUser } from "./ListBlog";
import Image from "next/image";
import formatDate, { formatTimeFromNow } from "@/lib/utils";
import Link from "next/link";
interface cardProps {
  blog: BlogWithUser;
  index: number;
  total: number;
}
const Card = ({ blog, index, total }: cardProps) => {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className={`relative group py-4`}
    >
      <div
        className={`grid grid-cols-1 ${index === total - 1 ? "border-b-0" : "border-b border-b-border"} sm:grid-cols-2 py-4 lg:block gap-4 items-start`}
      >
        {blog.coverImage && (
          <div className="relative w-full aspect-video md:block lg:hidden bg-gray-200 border border-border">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              priority={false}
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 0vw"
            />
          </div>
        )}
        <div className="flex flex-col gap-2 lg:pl-4">
          <div className="flex items-center gap-3">
            {blog.user &&
              (blog.user.image ? (
                <Image
                  src={blog.user.image}
                  alt={blog.user.name || "user avatar"}
                  width={30}
                  height={30}
                  className="rounded-full h-auto w-auto object-cover"
                />
              ) : (
                <div className="w-[30px] h-[30px] rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-white border border-border">
                  {blog.user.name?.[0].toUpperCase() || "U"}
                </div>
              ))}

            <div className="text-sm flex flex-col text-gray-700">
              <span>{blog.user.name}</span>
              <span className="text-sm text-gray-600">
              Published on {formatDate(blog.createdAt)}
            </span>
            </div>
          </div>
          <h2 className="font-semibold text-black text-lg group-hover:underline transition duration-300">{blog.title}</h2>
          <p className="text-base text-gray-900 line-clamp-3">
            {blog.description}
          </p>
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 lg:block hidden transform -translate-x-1/2 -translate-y-1/2 text-gray-300 text-8xl opacity-10 pointer-events-none">
        {index + 1}
      </div>
    </Link>
  );
};

export default Card;
