import React from "react";

const CommentsLoader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 inline-flex items-center cursor-not-allowed">
      <span className="w-4 h-4 border-2 border-t-gray-400 border-gray-200 rounded-full animate-spin dark:border-gray-600 dark:border-t-white me-3"></span>
      {text}
    </div>
  );
};

export default CommentsLoader;
