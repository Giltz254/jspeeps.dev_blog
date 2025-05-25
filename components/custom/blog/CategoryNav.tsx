"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CategoryNav({ tags }: { tags: string[] | [] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag");

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollWidth > el.clientWidth + el.scrollLeft);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -200 : 200;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setTimeout(checkScroll, 300);
  };
  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;

    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <div className="relative flex items-center w-full h-full overflow-hidden bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 cursor-pointer bg-gradient-to-r from-white via-white/80 to-transparent px-4 h-full flex items-center"
        >
          <ChevronLeft size={24} className="text-gray-400" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth h-full items-center"
      >
        <Link
          href={`/blog/feed/1`}
          className={`text-base cursor-pointer transition-all duration-300 relative h-full flex items-center ${
            !currentTag ? "text-black" : "text-gray-800 hover:text-black"
          }`}
        >
          All
          {!currentTag && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
          )}
        </Link>

        {tags.map((tag, index) => {
          const formattedTag = tag.replace(/\s+/g, "-");
          const isActive = currentTag === formattedTag;
          return (
            <Link
              href={`/blog/feed/1?tag=${formattedTag}`}
              key={index}
              className="h-full flex items-center"
            >
              <span
                className={`text-base cursor-pointer transition-all h-full flex items-center duration-300 relative ${
                  isActive ? "text-black" : "text-gray-800 hover:text-black"
                }`}
              >
                {tag}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
                )}
              </span>
            </Link>
          );
        })}
      </div>

      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 cursor-pointer bg-gradient-to-l from-white via-white/80 to-transparent px-4 h-full flex items-center"
        >
          <ChevronRight size={24} className="text-gray-400" />
        </button>
      )}
    </div>
  );
}
