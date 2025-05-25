import Link from "next/link";
import React from "react";
import { FaRegComment } from "react-icons/fa";
import { PiHandsClapping } from "react-icons/pi";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import Bookmark from "./Bookmark";

interface ReactionsProps {
  isSingleBlogPage?: boolean;
  slug?: string;
  userId?: string;
  author?: string;
}
const Reactions = ({
  isSingleBlogPage,
  slug,
  userId,
  author,
}: ReactionsProps) => {
  return (
    <div
      className={`flex items-center justify-between gap-4 w-full text-sm ${isSingleBlogPage ? "border-y my-4 py-2 border-border" : "pb-2 lg:pr-4"}`}
    >
      <div className="flex items-center justify-center gap-4">
        <span className="flex items-center justify-center gap-1">
          <PiHandsClapping size={18} />
          {7}
        </span>
        <span className="flex items-center justify-center gap-1">
          <FaRegComment size={18} /> {3}
        </span>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Bookmark />

        {isSingleBlogPage && userId === author && (
          <Link
            href={`/blog/new?slug=${slug}`}
            className="relative group inline-flex items-center justify-center w-10 h-10 rounded-full border align-middle select-none font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none bg-transparent border-border text-stone-800 hover:bg-stone-800/5 hover:border-stone-800/5 shadow-sm hover:shadow-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-sm px-2 py-1 shadow z-20 whitespace-nowrap">
              Edit
              <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></span>
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Reactions;
