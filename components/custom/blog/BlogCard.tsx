import Image from "next/image";
import Link from "next/link";
import { BlogWithUser } from "./ListBlog";
import Reactions from "./Reactions";
import formatDate, { cn } from "@/lib/utils";
import { getUserId } from "@/lib/userId";

interface BlogCardProps {
  blog: BlogWithUser;
  isUserProfile?: boolean;
  index: number;
  total: number;
}
const BlogCard = async ({ blog, index, total }: BlogCardProps) => {
  let readTime = "0 min read";
  const userId = await getUserId();
  return (
    <div className={cn("flex flex-col lg:pr-4", index < total - 1 && "border-b")}>
      <Link
        href={`/blog/${blog.slug}`}
        key={blog.id}
        className={cn(
          "flex flex-col-reverse sm:flex-row items-start gap-4 group p-4",
          index !== undefined && index % 2 === 0 && "sm:flex-row-reverse"
        )}
      >
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-[family-name:var(--font-lora)] font-semibold text-black group-hover:underline transition-all duration-300">
            {blog.title}
          </h2>
          <p className="text-gray-900 font-normal text-base mt-1 font-[family-name:var(--font-eb-garamond)]">
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
              <p className="font-medium text-black">{blog.user.name}</p>
              <div className="text-gray-500 text-sm font-[family-name:var(--font-eb-garamond)]">
                <span className="">{formatDate(blog.createdAt)}</span> ·{" "}
                {blog.readtime || readTime}
              </div>
            </div>
          </div>
        </div>
        {blog.coverImage && (
          <div className="min-w-[100px] bg-gray-200 border-border sm:aspect-square sm:w-[160px] w-full border aspect-video relative after:content-[''] after:absolute after:w-full after:h-full after:bg-blue-100 after:hidden sm:after:block after:top-2 after:right-2 after:border-l-2 after:border-b-2 after:border-blue-500 group-hover:after:right-0 group-hover:after:top-0 after:transition-all after:duration-500">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover z-[2]"
              priority={false}
              sizes="(max-width: 640px) 100vw, (min-width: 640px) 160px, 160px"
            />
          </div>
        )}
      </Link>
      <Reactions
        blogId={blog.id}
        claps={blog._count.claps}
        Clapped={blog.clappedByUser}
        userId={userId}
        bookmarked={blog.bookmarkedByUser}
        comments={blog._count.comments}
        slug={blog.slug}
      />
    </div>
  );
};

export default BlogCard;
