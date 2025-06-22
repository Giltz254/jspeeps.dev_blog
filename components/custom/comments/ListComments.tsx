"use client";

import CommentCard from "./CommentCard";
import useSWRInfinite from "swr/infinite";
import { Comment, User } from "@prisma/client";
import { fetchPaginatedComments } from "@/lib/fetchers";
import { useCallback } from "react";
import CommentsLoader from "./CommentsLoader";
import { Button } from "@/components/ui/button";

export type CommentWithUser = Comment & {
  user: Pick<User, "id" | "name" | "image">;
  repliedToUser: Pick<User, "id" | "name"> | null;
  _count: {
    replies: number;
    claps: number;
  };
  claps: {
    id: string;
  }[];
};

interface ListCommentsProps {
  blogId: string;
  userId?: string;
  data?: PaginatedCommentResponse[];
  size?: number;
  setSize?: (size: number) => void;
  mutate?: () => void;
  isValidating?: boolean;
}

interface PaginatedCommentResponse {
  comments: CommentWithUser[];
  totalCount: number;
  hasMore: boolean;
}

const LIMIT = 10;

const ListComments = ({
  blogId,
  userId,
  data: externalData,
  size: externalSize,
  setSize: externalSetSize,
  mutate: externalMutate,
  isValidating: externalValidating,
}: ListCommentsProps) => {
  const getKey = (
    pageIndex: number,
    previousPageData: PaginatedCommentResponse | null
  ) => {
    if (previousPageData && !previousPageData.hasMore) return null;
    return [blogId, null, userId, pageIndex + 1] as const;
  };

  const {
    data: swrData,
    size: swrSize,
    setSize: swrSetSize,
    mutate: swrMutate,
    isValidating: swrIsValidating,
  } = useSWRInfinite(
    getKey,
    ([blogId, parentId, userId, page]: readonly [
      string,
      string | null,
      string | undefined,
      number,
    ]) => fetchPaginatedComments(blogId, parentId, userId, page, LIMIT)
  );
  const data = externalData ?? swrData;
  const size = externalSize ?? swrSize;
  const setSize = externalSetSize ?? swrSetSize;
  const mutate = externalMutate ?? swrMutate;
  const isValidating = externalValidating ?? swrIsValidating;

  const comments = data ? data.flatMap((page) => page.comments) : [];
  const hasMore = data?.[data.length - 1]?.hasMore ?? true;

  const refetchTopLevelComments = useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <div className="mt-4" id="comments">
      {comments.map((comment) => (
        <div key={comment.id} id={comment.id}>
          <CommentCard
            comment={comment}
            onReplyCreated={refetchTopLevelComments}
            userId={userId}
          />
        </div>
      ))}
      <div className="text-center py-4">
        {hasMore ? (
          isValidating ? (
            <CommentsLoader text="Loading comments..." />
          ) : (
            <Button
              disabled={isValidating}
              variant="outline"
              onClick={() => setSize(size + 1)}
              className="mx-auto mt-4 px-6 py-2 shadow-none text-sm font-medium cursor-pointer rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 transition"
            >
              Load More
            </Button>
          )
        ) : comments.length > 0 ? (
          <p className="border border-gray-200 bg-gray-50 text-gray-500 text-sm px-4 py-3 rounded-lg w-fit mx-auto">
            End
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default ListComments;
