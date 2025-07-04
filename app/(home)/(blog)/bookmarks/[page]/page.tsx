import ListBlog from "@/components/custom/blog/ListBlog";
import Alert from "@/components/custom/forms/Alert";
import { getUserId } from "@/lib/userId";
import { Metadata } from "next";
async function getBookmarks({
  page = 1,
  limit = 10,
  userId,
}: {
  page: number;
  limit: number;
  userId: string | null;
}) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/bookmarks/${page}`,
      {
        method: "GET",
        headers: {
          "x-limit": limit.toString(),
          ...(userId ? { "x-user-id": userId } : {}),
          "Content-Type": "application/json",
        },
        cache: "no-store",
        next: {
          tags: ["blogs"],
        },
      }
    );

    if (res.status === 401) {
      console.error("Unauthorized access, redirecting to login.");
      return { redirectToLogin: true };
    }
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({}));
      throw new Error(error || `Error: ${res.status}`);
    }
    const data = await res.json();
    return { success: data };
  } catch (err) {
    console.error("Error fetching bookmarks:", err);
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

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
  const userId = await getUserId();
  const currentPage = parseInt(page, 10) || 1;
  const { success, error } = await getBookmarks({
    page: currentPage,
    limit,
    userId,
  });
  if (error) {
    return <Alert error message="Error fetching blogs" />;
  }
  if (!success) {
    return <Alert error message="No Posts" />;
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
          <ListBlog
            isBookmark={true}
            blogs={blogs}
            hasMore={hasMore}
            currentPage={currentPage}
          />
        </div>
        <div className="w-full lg:w-1/3"></div>
      </div>
    </div>
  );
};

export default Bookmarks;
