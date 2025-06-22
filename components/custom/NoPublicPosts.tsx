import Link from "next/link";
import React from "react";

const NoPublicPosts = () => {
  return (
    <div className="flex flex-col items-center rounded-xl justify-center text-center p-6 sm:p-8 md:p-10 bg-white w-full">
      <div className="mb-6">
        <svg
          className="w-24 h-24 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
      </div>
      <h2 className="text-white text-2xl sm:text-3xl font-bold mb-3 leading-tight">
        No Public Posts Yet
      </h2>
      <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8">
        Looks like you haven't made any posts yet. Don't worry, just click the
        'Create' button and let the readers know you're out there.
      </p>
      <Link
        href={"/blog/new"}
        className="inline-flex px-5 py-2.5 text-white text-sm font-medium rounded-md shadow-sm transition duration-300 ease-in-out
             bg-gradient-to-r from-slate-500 via-blue-500 to-blue-600
             hover:from-slate-600 hover:via-blue-600 hover:to-blue-700
             focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 mt-4"
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
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
        Create
      </Link>
    </div>
  );
};

export default NoPublicPosts;
