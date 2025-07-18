"use client";
import { bookmarkBlog } from "@/actions/blogs/bookmark-blog";
import { useState } from "react";
const Bookmark = ({
  bookmarked,
  userId,
  blogId,
}: {
  bookmarked: boolean;
  userId: string | null;
  blogId: string;
}) => {
  const [userHasBookmarked, setUserHasBookmarked] = useState<boolean>(
    !!userId && bookmarked
  );
  const [isBookmarking, setIsBookmarking] = useState<boolean>(false);

  const handleSaveClick = async () => {
    if (!userId || isBookmarking) return;
    setIsBookmarking(true);

    try {
      setUserHasBookmarked((prev) => !prev);
      await bookmarkBlog(blogId, userId);
    } catch (error) {
      setIsBookmarking(false);
    } finally {
      setIsBookmarking(false);
    }
  };

  const isActive = !!userId && userHasBookmarked;

  return (
    <button
      onClick={handleSaveClick}
      disabled={!userId}
      className={`relative group cursor-pointer flex items-center justify-center w-10 h-10 rounded-full border select-none font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm shadow-sm hover:shadow-md ${
        isActive
          ? "bg-black border-black text-white"
          : "bg-white border-stone-300 text-stone-600 hover:bg-stone-50"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isActive ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 transition-colors"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
        />
      </svg>
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-sm px-2 py-1 shadow z-20 whitespace-nowrap">
        {isActive ? "Bookmarked" : "Save for later"}
        <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></span>
      </span>
    </button>
  );
};

export default Bookmark;
