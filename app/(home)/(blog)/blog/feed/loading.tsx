import { ChevronRight } from "lucide-react";
import React from "react";
const LoadingSkeleton = () => {
  return (
    <div className="relative flex items-center w-full h-full overflow-hidden bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex gap-6 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth h-full items-center">
        {[...Array(20)].map((_, idx) => (
          <div
            key={idx}
            className="h-6 max-w-20 min-w-20 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>
      <div className="absolute right-0 z-10 bg-gradient-to-l from-white via-white/80 to-transparent px-4 h-full flex items-center">
        <ChevronRight size={24} className="text-gray-200" />
      </div>
    </div>
  );
};
const BlogCardSkeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex flex-col lg:pr-4 animate-pulse ${className}`}>
      <div className="flex flex-col-reverse sm:flex-row items-start gap-4 p-4">
        <div className="flex-1 w-full">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-full mb-4" />
          <div className="flex items-center gap-2 mt-4">
            <div className="h-8 w-8 bg-gray-300 rounded-full" />
            <div className="text-sm space-y-2 w-full">
              <div className="h-4 bg-gray-200 w-24 rounded" />
              <div className="h-3 bg-gray-200 w-32 rounded" />
            </div>
          </div>
        </div>
        <div className="min-w-[100px] sm:aspect-square sm:w-[160px] w-full border aspect-video relative bg-gray-200 rounded" />
      </div>
      <div className="px-4 pb-4 flex gap-4">
        <div className="h-4 w-10 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
    </div>
  );
};
const CardSkeleton = ({ index, total }: { index: number; total: number }) => {
  return (
    <div className={`relative group py-4`}>
      <div
        className={`grid grid-cols-1 ${
          index === total - 1 ? "border-b-0" : "border-b border-b-border"
        } sm:grid-cols-2 py-4 lg:block gap-4 items-start animate-pulse`}
      >
        <div className="relative w-full aspect-video md:block lg:hidden bg-gray-200 border border-border rounded" />

        <div className="flex flex-col gap-2 lg:pl-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[30px] rounded-full bg-gray-300" />
            <div className="text-sm flex flex-col gap-1 w-full">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-200 rounded w-36" />
            </div>
          </div>
          <div className="h-5 bg-gray-300 rounded w-3/4 mt-2" />
          <div className="space-y-2 mt-1">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-11/12" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 lg:block hidden transform -translate-x-1/2 -translate-y-1/2 text-gray-300 text-8xl opacity-10 pointer-events-none">
        {index + 1}
      </div>
    </div>
  );
};

const loading = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-white w-full">
      <div className="sticky top-16 h-16 w-full border-b z-10">
        <LoadingSkeleton />
      </div>
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex-1 pb-10 lg:border-r lg:border-border">
          {[...Array(10)].map((_, i, arr) => (
            <BlogCardSkeleton
              key={i}
              className={i !== arr.length - 1 ? "border-b" : ""}
            />
          ))}
        </div>
        <div className="hidden lg:block lg:w-1/3 w-full lg:min-h-[calc(100vh-64px)]">
          {Array.from({ length: 10 }).map((_, i) => (
            <CardSkeleton key={i} index={i} total={10} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default loading;
