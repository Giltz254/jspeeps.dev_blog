import Image from "next/image";
import Link from "next/link";
import { BlogWithUser } from "./ListBlog";
import Reactions from "./Reactions";
import formatDate, {
  Block,
  calculateReadTime,
} from "@/lib/utils";
import { getUserId } from "@/lib/userId";

interface BlogCardProps {
  blog: BlogWithUser;
  isUserProfile?: boolean;
}
const BlogCard = async ({ blog, isUserProfile }: BlogCardProps) => {
  let readTime = "0 min read";
  if (Array.isArray(blog.content)) {
    const blocks = blog.content as Block[];
    readTime = calculateReadTime(blocks);
  }
  const userId = await getUserId();
  return (
    <div className="flex flex-col border-b lg:pr-4 font-[family-name:var(--font-eb-garamond)]">
      <Link
        href={`/blog/${blog.slug}`}
        key={blog.id}
        className="flex flex-col-reverse sm:flex-row items-start gap-4 group p-4"
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
                {readTime}
              </div>
            </div>
          </div>
        </div>
        {blog.coverImage && (
          <div className="min-w-[100px] bg-gray-200 border-border sm:aspect-square sm:w-[160px] w-full border aspect-video relative">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority={false}
              sizes="(max-width: 640px) 100vw, (min-width: 640px) 160px, 160px"
            />
          </div>
        )}
      </Link>
      <Reactions
        blogId={blog.id}
        claps={blog._count.claps}
        Clapped={!!blog.claps.length}
        userId={userId}
        bookmarked={!!blog.bookmarks.length}
        comments={blog._count.comments}
        slug={blog.slug}
      />
    </div>
  );
};

export default BlogCard;
