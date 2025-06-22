"use client";
import { generateSlug } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { PiDotDuotone } from "react-icons/pi";
import { HiChevronRight, HiChevronDown } from "react-icons/hi";

const Toc = ({ selector }: { selector: string }) => {
  const [headings, setHeadings] = useState<HTMLHeadElement[]>([]);
  const [currentHeadingID, setCurrentHeadingID] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listWrapperRef = useRef<HTMLDivElement>(null);

  function getRandomNumbers() {
    const digits = new Set();
    while (digits.size < 6) {
      digits.add(Math.floor(Math.random() * 10));
    }
    return Array.from(digits).join("");
  }
  useEffect(() => {
  if (headings.length > 0) {
    setIsOpen(true);
  }
}, [headings]);
  useEffect(() => {
    const headingList = document
      .querySelector(selector)!
      .querySelectorAll("h2, h3, h4, h5, h6") as NodeListOf<HTMLHeadElement>;

    const headingArray = Array.from(headingList);
    headingArray.forEach((heading) => {
      const slug = generateSlug(heading.innerText);
      heading.dataset.id = `${slug}`;
    });

    setHeadings(headingArray);
  }, [selector]);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (headings.length > 0) {
      observer = new IntersectionObserver(
        (entries) => {
          let foundActiveHeading: string | undefined = undefined;
          const firstHeading = headings[0];
          if (firstHeading) {
            const firstHeadingRect = firstHeading.getBoundingClientRect();
            const rootMarginTop = -120;
            if (firstHeadingRect.bottom < (rootMarginTop * -1)) {
                foundActiveHeading = undefined;
            }
          }
          if (foundActiveHeading === undefined) {
              for (let i = entries.length - 1; i >= 0; i--) {
                  const entry = entries[i];
                  if (entry.isIntersecting) {
                      foundActiveHeading = (entry.target as HTMLHeadElement).dataset.id;
                      break;
                  }
              }
          }
          if (foundActiveHeading !== currentHeadingID) {
            setCurrentHeadingID(foundActiveHeading);
          }
        },
        {
          rootMargin: "-120px 0px -50% 0px",
          threshold: 0.5,
        }
      );

      headings.forEach((h) => observer.observe(h));
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [headings, currentHeadingID]);


  useEffect(() => {
    const element = listWrapperRef.current?.querySelector(
      `button[data-id="${currentHeadingID}"]`
    );
    if (currentHeadingID && element) {
      listWrapperRef.current?.scrollTo({
        top: (element as HTMLElement).offsetTop - (listWrapperRef.current?.clientHeight || 0) / 2 + (element as HTMLElement).clientHeight / 2,
        behavior: "smooth",
      });
    }
  }, [currentHeadingID]);
  return (
    <div
      className="border border-slate-200 rounded-md bg-white w-full overflow-hidden"
      ref={wrapperRef}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full cursor-pointer text-start px-4 py-3 flex items-center gap-2 font-medium text-black"
      >
        {isOpen ? (
          <HiChevronDown className="text-black" />
        ) : (
          <HiChevronRight className="text-black" />
        )}
        Table Of Contents
      </button>

      <div
        className={`transition-all duration-300 ${
          isOpen ? "max-h-[calc(100vh-200px)]" : "max-h-0"
        } overflow-y-auto`}
        ref={listWrapperRef}
      >
        <div className="px-4 py-2">
          <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
            In this page
          </h3>

          {headings.map((head, index) => {
            const tagLevel = head.tagName.match(/\d+/)?.[0] || "2";
            return (
              <button
                key={head.dataset.id}
                data-id={head.dataset.id}
                onClick={() => {
                  window.scrollTo({
                    top:
                      head.getBoundingClientRect().top + window.scrollY - 120,
                    behavior: "smooth",
                  });
                }}
                style={{ paddingLeft: `${+tagLevel * 8}px` }}
                className={`group flex w-full items-start cursor-pointer text-start text-sm pr-3 py-4 transition-colors duration-150 ${
                  index !== headings.length - 1
                    ? "border-b border-gray-100"
                    : ""
                } ${
                  currentHeadingID === head.dataset.id
                    ? "text-sky-600 font-medium"
                    : "text-gray-700 hover:text-sky-500"
                }`}
              >
                <PiDotDuotone
                  className={`min-w-[20px] mt-0.5 transition-colors ${
                    currentHeadingID === head.dataset.id
                      ? "text-sky-600"
                      : "text-gray-400 group-hover:text-sky-500"
                  }`}
                />
                <span
                  className="ml-1"
                  dangerouslySetInnerHTML={{ __html: head.innerHTML }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Toc;