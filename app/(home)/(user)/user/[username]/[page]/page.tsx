import { getUserFollowData } from "@/actions/follow/fetch-followers";
import { followUser } from "@/actions/follow/follow";
import Follow from "@/components/custom/blog/Follow";
import ListBlog, { BlogWithUser } from "@/components/custom/blog/ListBlog";
import PageReload from "@/components/custom/blog/PageReload";
import SectionHeader from "@/components/custom/blog/SectionHeader";
import NoPublicPosts from "@/components/custom/NoPublicPosts";
import { getUserId } from "@/lib/userId";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const Profile = async ({
  params,
}: {
  params: Promise<{ username: string; page: string }>;
}) => {
  const { username, page } = await params;
  let error: string | null = null;
  if (!username) notFound();
  const currentPage = parseInt(page ?? "1", 10);
  const userId = await getUserId();
  const [staticRes, dynamicRes] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/blogs/static/${currentPage}`,
      {
        cache: "force-cache",
        next: { tags: ["blogs"] },
      }
    ).then((res) => res.json()),
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/blogs/dynamic/${currentPage}`,
      {
        headers: { "x-user-id": userId ?? "" },
        cache: "no-store",
        next: { tags: ["blogs"] },
      }
    ).then((res) => res.json()),
  ]);
  if (staticRes.error) error = staticRes.error;
  if (dynamicRes.error) error = dynamicRes.error;
  const staticData = staticRes.success;
  const dynamicData = dynamicRes.success;
  let blogsWithUserData: BlogWithUser[] = [];
  if (!error) {
    blogsWithUserData = staticData.blogs.map(
      (blog: any, i: number): BlogWithUser => ({
        ...blog,
        clappedByUser: !!dynamicData[i]?.claps.length,
        bookmarkedByUser: !!dynamicData[i]?.bookmarks.length,
      })
    );
  }
  const { userProfile, hasMore } = staticData || {};
  const displayName = userProfile?.name || username;
  const displayImage = userProfile?.image;
  const Id = userProfile?.id;
  if (!Id) error = "User not found";
  const [followersData, followData] = Id
    ? await Promise.all([
        getUserFollowData(Id, userId),
        followUser({ followingId: Id }),
      ])
    : [{ followers: [], _count: { followers: 0 } }, null];

  const { followers, _count } = followersData;
  console.log("Followers>>>", followers)
  const follow = followData;
  const firstLetter = displayName ? displayName.charAt(0).toUpperCase() : "";

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-white w-full">
      <div className="flex flex-col lg:flex-row max-w-7xl min-h-[calc(100vh-64px)] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex-1 flex flex-col gap-4 pb-10 lg:border-r lg:border-border">
          <div className="flex flex-col w-full lg:pr-4">
            <div className="w-full bg-white pt-10 pb-8 px-4 sm:px-8 overflow-hidden">
              <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between">
                <div className="flex items-center gap-6">
                  {displayImage ? (
                    <div className="w-24 h-24 relative border-2 border-gray-200 rounded-full overflow-hidden bg-gray-100">
                      <Image
                        src={displayImage}
                        alt={`${displayName}'s profile picture`}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-24 h-24 border-4 border-border rounded-full bg-gray-300 text-white font-bold text-4xl">
                      {firstLetter}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {displayName}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">@{username}</p>
                    {userId === Id && (
                      <Link
                        href="/settings/profile"
                        className="inline-block mt-4 px-5 py-2.5 text-white text-sm font-medium rounded shadow-sm bg-gradient-to-r from-slate-500 via-blue-500 to-blue-600 hover:from-slate-600 hover:via-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
                      >
                        Settings
                      </Link>
                    )}
                  </div>
                </div>
                <div className="mt-6 md:mt-0">
                  <Follow
                    id={Id}
                    userId={userId}
                    isFollowing={Boolean(follow)}
                    followersCount={_count.followers ?? 0}
                  />
                </div>
              </div>
            </div>
            <div className="w-full mt-8 py-4">
              <SectionHeader title="Published articles" />
              {error ? (
                <div className="flex flex-col items-center justify-center text-center py-8 px-4">
                  <h4 className="text-xl font-bold text-red-600">
                    Failed to Load Posts
                  </h4>
                  <p className="text-md text-gray-700 mt-2">{error}</p>
                  <PageReload />
                </div>
              ) : blogsWithUserData.length === 0 ? (
                <NoPublicPosts />
              ) : (
                <ListBlog
                  currentPage={currentPage}
                  blogs={blogsWithUserData}
                  hasMore={hasMore}
                  username={username}
                />
              )}
            </div>
          </div>
        </div>
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

export default Profile;
