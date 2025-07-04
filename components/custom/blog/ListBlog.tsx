import BlogCard from "./BlogCard";
import Pagination from "./Pagination";
export type BlogWithUser = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  createdAt: Date;
  bookmarkedByUser: boolean;
  clappedByUser: boolean;
  readtime?: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  _count: {
    claps: number;
    comments: number;
  };
  claps: {
    id: string;
  }[];
  bookmarks: {
    id: string;
  }[];
};
interface BlogCardProps {
  blogs: BlogWithUser[];
  hasMore: boolean;
  currentPage: number;
  isUserProfile?: boolean;
  tag?: string
  username?: string
  isBookmark?: boolean
}
const ListBlog = ({
  blogs,
  hasMore,
  currentPage,
  isUserProfile,
  tag,
  username,
  isBookmark
}: BlogCardProps) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <section className="">
        {blogs.map((blog, index) => (
          <BlogCard key={blog.id} index={index} blog={blog} isUserProfile={isUserProfile} />
        ))}
      </section>
      <Pagination isBookMark={isBookmark} tag={tag} hasMore={hasMore} currentPage={currentPage} username={username} />
    </div>
  );
};

export default ListBlog;
