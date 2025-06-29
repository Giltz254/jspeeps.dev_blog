"use client";
import Link from "next/link";
import React, { useCallback } from "react";
import AddCommentsForm from "./AddCommentsForm";
import ListComments from "./ListComments";
import useSWRInfinite from "swr/infinite";
import { fetchPaginatedComments } from "@/lib/fetchers";
import { CommentWithUser } from "./ListComments";
import { CommentsProvider } from "./CommentsContext";

interface CommentsProps {
  blogId: string;
  creatorId: string;
  userId: string | undefined;
}

const Comments = ({ blogId, creatorId, userId }: CommentsProps) => {
  const LIMIT = 10;
  const getKey = (
    pageIndex: number,
    previousPageData: { comments: CommentWithUser[]; hasMore: boolean } | null
  ) => {
    if (previousPageData && !previousPageData.hasMore) return null;
    return [blogId, null, userId, pageIndex + 1] as const;
  };

  const { data, size, setSize, mutate, isValidating } = useSWRInfinite(
    getKey,
    ([blogId, parentId, userId, page]) =>
      fetchPaginatedComments(blogId, parentId, userId, page, LIMIT)
  );
  const refetchTopLevelComments = useCallback(() => {
    mutate();
  }, [mutate]);
  return (
    <CommentsProvider>
      <div className="px-4 w-full pb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-medium text-left">
            {userId ? (
              "Share your thoughts"
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-block px-5 py-2.5 text-white text-sm font-medium rounded-md shadow-sm transition duration-300 ease-in-out
             bg-gradient-to-r from-slate-500 via-blue-500 to-blue-600
             hover:from-slate-600 hover:via-blue-600 hover:to-blue-700
             focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
                >
                  Login
                </Link>{" "}
                to add a comment
              </>
            )}
          </div>
        </div>
        <AddCommentsForm
          blogId={blogId}
          userId={userId}
          creatorId={creatorId}
          onCommentAdded={refetchTopLevelComments}
        />
        {data?.[0]?.totalCount !== undefined && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xl text-slate-800 mt-4 font-medium">
              Comments
            </span>
            <span className="inline-flex items-center justify-center mt-4 bg-slate-500 text-white w-6 h-6 rounded-full text-sm shadow-sm">
              {data[0].totalCount}
            </span>
          </div>
        )}
        <ListComments
          blogId={blogId}
          userId={userId ?? undefined}
          data={data}
          size={size}
          setSize={setSize}
          mutate={mutate}
          isValidating={isValidating}
        />
      </div>
    </CommentsProvider>
  );
};

export default Comments;
