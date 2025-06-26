"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showErrorToast, showSuccessToast } from "../layout/Toasts";
import { Check, UserPlus } from "lucide-react";

type FollowProps = {
  id: string;
  isFollowing: boolean;
  userId: string | null;
  followersCount: number;
};

const Follow = ({
  id,
  isFollowing: initialFollowState,
  userId,
  followersCount: initialFollowersCount,
}: FollowProps) => {
  const [isFollowing, setIsFollowing] = useState(
    userId ? initialFollowState : false
  );
  const [isLoading, setIsLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);

  const router = useRouter();
  const isSelf = userId === id;

  useEffect(() => {
    if (userId) {
      setIsFollowing(initialFollowState);
    }
  }, [initialFollowState, userId]);

  const handleFollow = async () => {
    if (!userId) {
      showErrorToast("Sign in to follow");
      router.push("/login");
      return;
    }

    if (isLoading) return;

    const prevFollowing = isFollowing;
    const prevFollowersCount = followersCount;
    const newFollowState = !prevFollowing;

    setIsLoading(true);
    setIsFollowing(newFollowState);
    setFollowersCount(prevFollowersCount + (newFollowState ? 1 : -1));

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followId: id }),
      });

      const data = await res.json();

      if (data.success === "followed") {
        showSuccessToast("Followed successfully");
      } else if (data.success === "unfollowed") {
        showSuccessToast("Unfollowed successfully");
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Follow request failed:", error);
      setIsFollowing(prevFollowing);
      setFollowersCount(prevFollowersCount);
      showErrorToast("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSelf) {
    return (
      <div className="mt-4 text-sm text-stone-600">
        {followersCount} follower{followersCount !== 1 && "s"}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        onClick={handleFollow}
        disabled={isLoading}
        className={`group inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition
          ${
            isFollowing
              ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100"
              : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border border-neutral-200"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <span
          className={`flex items-center justify-center rounded-full p-1 transition ${
            isFollowing
              ? "bg-blue-100 text-blue-700"
              : "bg-white text-neutral-700"
          }`}
        >
          {isFollowing ? (
            <Check className="w-4 h-4" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
        </span>
        <span>{isFollowing ? "Following" : "Follow"}</span>
      </button>
      <span className="text-sm text-stone-600">
        {followersCount} follower{followersCount !== 1 && "s"}
      </span>
    </div>
  );
};

export default Follow;
