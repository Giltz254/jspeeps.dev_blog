import Image from "next/image";
import Link from "next/link";
import { BlogWithUser } from "./ListBlog";
import Reactions from "./Reactions";
import { formatTimeFromNow } from "@/lib/utils";

interface BlogCardProps {
  blog: BlogWithUser;
  isUserProfile?: boolean;
}
const BlogCard = ({ blog, isUserProfile }: BlogCardProps) => {
  return (
    <div className="flex flex-col border-b lg:pr-4">
      <Link
        href={`/blog/${blog.slug}`}
        key={blog.id}
        className="flex flex-col-reverse sm:flex-row items-start gap-4 group p-4"
      >
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-black group-hover:underline transition-all duration-300">
            {blog.title}
          </h2>
          <p className="text-gray-700 font-medium text-base mt-1">
            {blog.description}
          </p>
          <div className="flex items-center gap-2 mt-4">
            {blog.user.image && blog.user.name && (
              <Image
                src={blog.user.image}
                alt={blog.user.name}
                width={32}
                height={32}
                className="rounded-full overflow-hidden h-8 w-8 object-cover"
              />
            )}
            <div className="text-sm text-gray-700">
              <p className="font-medium text-green-700">{blog.user.name}</p>
              <div className="text-gray-500 text-sm">
                <span className="">
                  {formatTimeFromNow(blog.createdAt)}
                </span>{" "}
                · 2 min read
              </div>
            </div>
          </div>
        </div>
        {blog.coverImage && (
          <div className="min-w-[100px] sm:aspect-square sm:w-[160px] w-full border aspect-video relative">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </Link>
      <Reactions />
    </div>
  );
};

export default BlogCard;
