import { FaRegBookmark } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import formatDate from "@/lib/utils";
export type ArtcleCardProps = {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage?: string;
  createdAt: Date;
  user: {
    name: string;
    image?: string;
  };
};
interface ArticleCardProp {
  blog: ArtcleCardProps;
}
export default function ArticleCard({ blog }: ArticleCardProp) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="bg-white overflow-hidden group flex flex-col h-full border"
    >
      {blog.coverImage && (
        <div className="w-full h-48 relative">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            priority={false}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover bg-gray-100"
          />
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <div className="h-6 w-6 flex items-center justify-center rounded-full">
            {blog.user.image ? (
              <Image
                src={blog.user.image}
                height={24}
                width={24}
                priority={false}
                alt={blog.user.name}
                className="rounded-full bg-gray-50 object-cover border border-border h-6 w-6"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                {blog.user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-gray-400">Published</span>
          <span className="text-gray-400">by</span>
          <span className="text-gray-700 font-normal">{blog.user.name}</span>
        </div>
        <h2 className="text-lg block font-bold text-gray-900 leading-snug group-hover:underline mt-2">
          {blog.title}
        </h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-3">{blog.description}</p>
        <div className="flex-grow" />
        <div className="flex items-center justify-between border-t text-gray-500 text-sm pt-2 mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaRegBookmark size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
