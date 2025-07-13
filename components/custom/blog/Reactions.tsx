"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaFacebook, FaLinkedinIn, FaRegComment } from "react-icons/fa";
import { PiHandsClapping } from "react-icons/pi";
import Bookmark from "./Bookmark";
import { clapBlog } from "@/actions/blogs/clap-blog";
import { Link2, Share } from "lucide-react";
import { Transition } from "@headlessui/react";
import { BsTwitterX } from "react-icons/bs";

interface ReactionsProps {
  isSingleBlogPage?: boolean;
  blogId: string;
  userId: string | null;
  author?: string;
  claps: number;
  Clapped: boolean;
  bookmarked: boolean;
  comments: number;
  slug: string;
}
const Reactions = ({
  isSingleBlogPage,
  blogId,
  userId,
  author,
  claps,
  Clapped,
  bookmarked,
  comments,
  slug,
}: ReactionsProps) => {
  const [clapCount, setClapCount] = useState<number>(claps);
  const [userHasClapped, setUserHasClapped] = useState<boolean>(Clapped);
  const [isClapping, setIsClapping] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setIsOpen(false);
    setTimeout(() => setCopied(false), 2000);
  }

  function openShare(path: string) {
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`;
    const url = path.replace("{{url}}", encodeURIComponent(shareUrl));
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modal = modalRef.current;
      const button = buttonRef.current;

      if (
        modal &&
        !modal.contains(event.target as Node) &&
        button &&
        !button.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);
  const handleClap = async () => {
    if (!userId || isClapping) return;
    setIsClapping(true);

    try {
      setClapCount((prev) => (userHasClapped ? prev - 1 : prev + 1));
      setUserHasClapped((prev) => !prev);
      await clapBlog(blogId, userId);
    } catch (error) {
      setIsClapping(false);
    } finally {
      setIsClapping(false);
    }
  };
  return (
    <div
      className={`flex items-center justify-between gap-4 w-full text-sm ${isSingleBlogPage ? "border-y mt-4 py-2 border-border" : "pb-2 lg:pr-4"}`}
    >
      <div className="flex items-center justify-center gap-4">
        <div className="relative group">
          <button
            disabled={isClapping}
            onClick={handleClap}
            className="flex items-center justify-center gap-1 disabled:cursor-not-allowed"
          >
            <span
              className={`p-2 rounded-full transition-colors ${userId ? "cursor-pointer" : "cursor-not-allowed"} ${
                userId && userHasClapped
                  ? "bg-black text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <PiHandsClapping size={18} />
            </span>
            {clapCount}
          </button>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-sm px-2 py-1 shadow z-20 whitespace-nowrap">
            {userId ? "Clap" : "Sign in to clap"}
            <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></span>
          </div>
        </div>
        <span className="flex items-center justify-center gap-1">
          <FaRegComment size={18} /> {comments}
        </span>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Bookmark bookmarked={bookmarked} userId={userId} blogId={blogId} />
        <div className="relative inline-block">
          <button
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className="relative group inline-flex items-center justify-center w-10 h-10 rounded-full border align-middle select-none font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none bg-transparent border-border text-stone-800 hover:bg-stone-800/5 hover:border-stone-800/5 shadow-sm hover:shadow-none cursor-pointer"
          >
            <Share size={18} />
            <span
              className={`absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-sm px-2 py-1 shadow z-20 whitespace-nowrap ${isOpen && "hidden"}`}
            >
              Share
              <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></span>
            </span>
          </button>
          <Transition
            show={isOpen}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95 -translate-y-2"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 -translate-y-2"
          >
            <div
              ref={modalRef}
              className={`absolute -top-48 right-0 z-10 w-64 p-4 bg-white border border-gray-200 rounded-md`}
            >
              <span className="absolute right-2 -translate-x-2 -bottom-1 w-2 h-2 bg-white border-r border-b rotate-45"></span>
              <div className="space-y-1">
                <button
                  onClick={handleCopy}
                  className="flex cursor-pointer items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition"
                >
                  <Link2 size={16} />
                  {copied ? "Copied" : "Copy link"}
                </button>
                <button
                  onClick={() =>
                    openShare("https://twitter.com/intent/tweet?url={{url}}")
                  }
                  className="flex cursor-pointer items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition"
                >
                  <BsTwitterX size={16} />
                  Share on X
                </button>
                <button
                  onClick={() =>
                    openShare(
                      "https://www.facebook.com/sharer/sharer.php?u={{url}}"
                    )
                  }
                  className="flex cursor-pointer items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition"
                >
                  <FaFacebook size={16} />
                  Share on Facebook
                </button>
                <button
                  onClick={() =>
                    openShare(
                      "https://www.linkedin.com/sharing/share-offsite/?url={{url}}"
                    )
                  }
                  className="flex items-center cursor-pointer gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition"
                >
                  <FaLinkedinIn size={16} />
                  Share on LinkedIn
                </button>
              </div>
            </div>
          </Transition>
        </div>
        {isSingleBlogPage && userId === author && (
          <Link
            href={`/blog/new?id=${blogId}`}
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
