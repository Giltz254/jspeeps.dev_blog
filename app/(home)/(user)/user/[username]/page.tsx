import ListBlog from "@/components/custom/blog/ListBlog";
import NoPublicPosts from "@/components/custom/NoPublicPosts";
import { getUserId } from "@/lib/userId";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogUserPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page: string }>;
}

interface UserProfileData {
  id: string;
  name: string;
  image: string | null;
}

interface BlogData {
  blogs: any[];
  hasMore: boolean;
  error: string | null;
  userProfile: UserProfileData | null;
}

async function getBlogsByUsername(
  username: string,
  page: number = 1,
  limit: number = 10
): Promise<BlogData> {
  if (!username) {
    return {
      blogs: [],
      hasMore: false,
      error: "Username is required.",
      userProfile: null,
    };
  }

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}?page=${page}&limit=${limit}`;

  try {
    const res = await fetch(url, {
      cache: "force-cache",
      next: {
        tags: ["blogs"],
      },
    });

    if (!res.ok) {
      const errorDetail = await res
        .json()
        .catch(() => ({ message: `HTTP error! Status: ${res.status}` }));
      if (res.status === 404) {
        return {
          blogs: [],
          hasMore: false,
          error: `User "${username}" not found.`,
          userProfile: null,
        };
      }
      let errorMessage = "An unknown error occurred.";
      if (res.status >= 500) {
        errorMessage = "Server error occurred. Please try again later.";
      } else if (res.status >= 400) {
        errorMessage =
          errorDetail.message || `Request failed with status: ${res.status}`;
      }
      return {
        blogs: [],
        hasMore: false,
        error: errorMessage,
        userProfile: null,
      };
    }

    const data = await res.json();
    if (
      !data ||
      !data.success ||
      !Array.isArray(data.success.blogs) ||
      typeof data.success.hasMore !== "boolean" ||
      !data.success.userProfile
    ) {
      return {
        blogs: [],
        hasMore: false,
        error: "Unexpected API response format for blogs or user profile.",
        userProfile: null,
      };
    }

    const blogs = data.success.blogs;
    const hasMore = data.success.hasMore;
    const userProfile: UserProfileData = data.success.userProfile;

    return { blogs, hasMore, error: null, userProfile };
  } catch (error) {
    let errorMessage = "Failed to retrieve blogs due to an unexpected issue.";
    if (error instanceof TypeError) {
      errorMessage =
        "Network error. Please check your internet connection and retry.";
    }
    return {
      blogs: [],
      hasMore: false,
      error: errorMessage,
      userProfile: null,
    };
  }
}

const BlogUserPage = async ({ params, searchParams }: BlogUserPageProps) => {
  const { username } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page ?? "1", 10);
  const limit: number = 10;
  const { blogs, hasMore, error, userProfile } = await getBlogsByUsername(
    username,
    currentPage,
    limit
  );
  if (!username || error === `User "${username}" not found.`) {
    notFound();
  }
  const displayName = userProfile?.name || username;
  const displayImage = userProfile?.image;
  const firstLetter = displayName ? displayName.charAt(0).toUpperCase() : "";
  const userId = await getUserId();
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-white w-full">
      <div className="flex flex-col lg:flex-row max-w-7xl min-h-[calc(100vh-64px)] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex-1 flex flex-col gap-4 pb-10 lg:border-r lg:border-border">
          <div className="flex flex-col w-full lg:pr-4">
            <div className="w-full bg-white pt-10 overflow-hidden pb-8">
              <div className="relative flex flex-col md:flex-row items-start">
                <div className="flex flex-col">
                  {displayImage ? (
                    <Image
                      src={displayImage}
                      alt={`${displayName}'s profile picture`}
                      width={120}
                      height={120}
                      className="rounded-xl object-cover border-4 border-border h-auto w-auto"
                    />
                  ) : (
                    <div
                      className="flex w-30 h-30 items-center border-4 border-border justify-center rounded-xl bg-gray-300 text-white font-bold text-5xl"
                      aria-label={`${displayName}'s initial avatar`}
                    >
                      {firstLetter}
                    </div>
                  )}
                  <Link
                    href={`/settings/profile`}
                    className=" px-5 py-2.5 text-white text-sm font-medium rounded-md shadow-sm transition duration-300 ease-in-out
                                 bg-gradient-to-r from-slate-500 via-blue-500 to-blue-600
                                 hover:from-slate-600 hover:via-blue-600 hover:to-blue-700
                                 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 mt-4 flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </Link>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 text-start md:text-left">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {displayName}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">@{username}</p>
                </div>
              </div>
            </div>
            <div className="w-full border border-border rounded-xl mt-8 py-4">
              <h3 className="text-xl font-semibold text-black border-b mb-4 px-4 pb-4">
                Published articles
              </h3>
              {error ? (
                <div className="flex flex-col items-center justify-center text-center py-8 px-4">
                  <h4 className="text-xl font-bold text-red-600">
                    Failed to Load Posts
                  </h4>
                  <p className="text-md text-gray-700 mt-2">{error}</p>
                  <button
                    className=" px-5 py-2.5 text-white text-sm font-medium rounded-md shadow-sm transition duration-300 ease-in-out
                                 bg-gradient-to-r from-slate-500 via-blue-500 to-blue-600
                                 hover:from-slate-600 hover:via-blue-600 hover:to-blue-700
                                 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 mt-4 flex items-center justify-center"
                  >
                    Retry
                  </button>
                </div>
              ) : blogs.length === 0 ? (
                <NoPublicPosts />
              ) : (
                <div className="className px-4">
                  <ListBlog
                    currentPage={currentPage}
                    blogs={blogs}
                    hasMore={hasMore}
                    username={username}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section (e.g., sidebar for suggestions, ads, or other information) */}
        <div className="w-full lg:w-1/3 lg:pl-4 py-10">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Suggested Content
            </h3>
            <p className="text-sm text-gray-600">
              This area can be used for related articles, ads, or other user
              profiles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogUserPage;
