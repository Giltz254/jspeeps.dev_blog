import { getBookmarks } from "@/actions/blogs/get-bookmarks";
import ListBlog from "@/components/custom/blog/ListBlog";
import Alert from "@/components/custom/forms/Alert";
import { Metadata } from "next";
interface BlogFeedProps {
  params: Promise<{ page: string }>;
}
export const metadata: Metadata = {
  title: {
    absolute: "Your library",
  },
  description:
    "JSpeeps.dev blog shares coding tips, JavaScript tricks, and tutorials to boost your frontend and backend skills with modern tools and frameworks.",
};
const Bookmarks = async ({ params }: BlogFeedProps) => {
  const { page } = await params;
  const limit: number = 10;
  const currentPage = parseInt(page, 10) || 1;
  const { success, error } = await getBookmarks({
    page: currentPage,
    limit,
  });
  if (error) {
    return <Alert error message="Error fetching blogs" />;
  }
  if (!success) {
    return (
      <div className="max-w-xl mx-auto">
        <Alert error message="No Posts" />;
      </div>
    );
  }
  const { blogs, hasMore } = success;
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-white w-full">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex-1 pb-10 lg:border-r lg:border-border">
          <div className="px-4 py-6 border-b border-border">
            <h1 className="text-2xl font-semibold text-gray-800">
              Your Library
            </h1>
          </div>

          <ListBlog blogs={blogs} hasMore={hasMore} currentPage={currentPage} />
        </div>
        <div className="w-1/3"></div>
      </div>
    </div>
  );
};

export default Bookmarks;
