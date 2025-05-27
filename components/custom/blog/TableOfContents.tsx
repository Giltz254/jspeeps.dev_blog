"use client";
import { generateSlug } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { PiDotDuotone } from "react-icons/pi";

const Toc = ({ selector }: { selector: string }) => {
  const [headings, setHeadings] = useState<HTMLHeadElement[]>([]);
  const [currentHeadingID, setCurrentHeadingID] = useState<
    string | undefined
  >();
  const listWrapperRef = useRef<HTMLDivElement>(null);
  function getRandomNumbers() {
    const digits = new Set();
    while (digits.size < 6) {
      const randomDigit = Math.floor(Math.random() * 10);
      digits.add(randomDigit);
    }
    return Array.from(digits).join("");
  }

  useEffect(() => {
    const headingList = document
      .querySelector(selector)!
      .querySelectorAll("h2, h3, h4, h5, h6") as NodeListOf<HTMLHeadElement>;
    const headingArray = Array.from(headingList);
    headingArray.forEach((heading) => {
      const slug = generateSlug(heading.innerText);
      const randomNumbers = getRandomNumbers();
      heading.dataset.id = `${slug}-${randomNumbers}`;
    });
    setHeadings(headingArray);
  }, [selector]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 1) {
            setCurrentHeadingID((entry.target as HTMLHeadElement).dataset.id);
          }
        });
      },
      {
        rootMargin: "0% 0% -60% 0%",
        threshold: 1,
      }
    );

    if (headings.length) {
      headings.forEach((s) => {
        observer.observe(s);
      });
    }

    return () => {
      return observer.disconnect();
    };
  }, [headings]);

  useEffect(() => {
    const element = listWrapperRef.current?.querySelector(
      'button[data-id="' + currentHeadingID + '"]'
    );

    if (currentHeadingID && element) {
      listWrapperRef.current?.scrollTo({
        top: (element as HTMLElement).offsetTop,
        behavior: "smooth",
      });
    }
  }, [currentHeadingID]);

  return (
    <div className="w-full" ref={listWrapperRef}>
      <div className="flex justify-start">
        <p className="capitalize text-lg font-semibold">
          In this page
        </p>
      </div>
      {headings &&
        headings.map((head) => {
          const tagLevel = head.tagName.match(/(\d+)/)?.[0] || "1";
          return (
            <button
              data-id={head.dataset.id}
              key={head.dataset.id}
              style={{ paddingLeft: +tagLevel * 7 + "px" }}
              className={`flex py-2 cursor-pointer pr-3 font-normal w-full items-start text-start ${
                currentHeadingID === head.dataset.id
                  ? "text-emerald-500 border-l border-emerald-400"
                  : "text-secondary-foreground"
              }`}
              onClick={() => {
                window.scrollTo({
                  top: head.getBoundingClientRect().top + window.scrollY - 120,
                  behavior: "smooth",
                });
              }}
            >
              <PiDotDuotone size={24} className="mr-2" />
              {head.innerHTML}
            </button>
          );
        })}
    </div>
  );
};

export default Toc;