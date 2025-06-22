import { Blog, User } from "@prisma/client";
import BlogCard from "./BlogCard";
import Pagination from "./Pagination";
export type BlogWithUser = Blog & {
  user: Pick<User, "id" | "name" | "image">;
  _count: {
    claps: number
    comments: number
  };
  claps: {
    id: string
  }[];
  bookmarks: {
    id: string
  }[]
};
interface BlogCardProps {
  blogs: BlogWithUser[];
  hasMore: boolean;
  currentPage: number;
  isUserProfile?: boolean;
  tag?: string
  username?: string
}
const ListBlog = ({
  blogs,
  hasMore,
  currentPage,
  isUserProfile,
  tag,
  username
}: BlogCardProps) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <section className="">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} isUserProfile={isUserProfile} />
        ))}
      </section>
      <Pagination tag={tag} hasMore={hasMore} currentPage={currentPage} username={username} />
    </div>
  );
};

export default ListBlog;
