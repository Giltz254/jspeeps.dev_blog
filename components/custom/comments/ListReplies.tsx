"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { CommentWithUser } from "./ListComments";
import { getComments } from "@/actions/comments/get-comments";
import ReplyCard from "./ReplyCard";
import CommentsLoader from "./CommentsLoader";
import { Button } from "@/components/ui/button";
import { useCommentsContext } from "./CommentsContext";

const ListReplies = ({
  comment,
  userId,
  onReplyCreated,
}: {
  comment: CommentWithUser;
  userId?: string;
  onReplyCreated: () => void;
}) => {
  const { repliesMap, handleReplyCreated, handleReplyDeleted, setRepliesMap } =
    useCommentsContext();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [hasMoreMap, setHasMoreMap] = useState<Record<string, boolean>>({});
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const pageRef = useRef(1);
  const hasFetchedRef = useRef(false);
  const scrollIntoViewRef = useRef<HTMLDivElement>(null);

  const fetchReplies = (page: number) => {
    startTransition(() => {
      getComments(comment.blogId, comment.id, userId, page, 5).then((res) => {
        setHasFetched(true);
        if ("error" in res) {
          setError(res.error);
          return;
        }
        if ("success" in res) {
          setRepliesMap((prev) => {
            const existing = prev[comment.id] || [];
            const existingIds = new Set(existing.map((r) => r.id));
            const newReplies = res.success.comments.filter(
              (r) => !existingIds.has(r.id)
            );
            return {
              ...prev,
              [comment.id]: [...existing, ...newReplies],
            };
          });
          const currentRepliesCount =
            (repliesMap[comment.id]?.length || 0) + res.success.comments.length;
          setHasMoreMap((prev) => ({
            ...prev,
            [comment.id]: currentRepliesCount < res.success.totalCount,
          }));
          pageRef.current += 1;
        }
      });
    });
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    pageRef.current = 1;
    setRepliesMap((prev) => ({ ...prev, [comment.id]: [] }));
    setHasMoreMap((prev) => ({ ...prev, [comment.id]: true }));
    fetchReplies(1);
    if (scrollIntoViewRef.current) {
      scrollIntoViewRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setTimeout(() => {
        window.scrollBy({ top: -120, behavior: "smooth" });
      }, 500);
    }
  }, []);

  const handleLoadMore = () => {
    fetchReplies(pageRef.current);
  };

  const replies = repliesMap[comment.id] || [];
  const hasMore = hasMoreMap[comment.id];

  return (
    <div ref={scrollIntoViewRef} className="text-sm">
      {error && <p className="text-rose-500">{error}</p>}

      {replies.map((r) => (
        <div
          key={r.id}
          className="relative ml-2 sm:ml-3 pl-4 sm:pl-6 border-l-2 border-slate-300"
        >
          <span className="absolute top-3 -left-[6px] sm:-left-[7px] w-3 h-3 bg-white border-l-2 border-b-2 border-sky-500 rotate-45" />

          <ReplyCard
            userId={userId}
            reply={r}
            onReplyCreated={onReplyCreated}
            onReplyAdded={(reply) => handleReplyCreated(comment.id, reply)}
            onReplyDeleted={(id) => handleReplyDeleted(comment.id, id)}
          />
        </div>
      ))}

      <div ref={loadMoreRef} className="text-center py-4">
        {!hasFetched ? (
          <CommentsLoader text="Loading replies..." />
        ) : replies.length === 0 ? (
          <p className="border border-gray-200 bg-gray-50 text-gray-500 text-sm px-4 py-3 rounded-lg w-fit mx-auto">
            No replies yet
          </p>
        ) : hasMore ? (
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="mx-auto mt-4 px-6 py-2 shadow-none text-sm font-medium cursor-pointer rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 transition"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Load More Replies"}
          </Button>
        ) : (
          <p className="border border-gray-200 bg-gray-50 text-gray-500 text-sm px-4 py-3 rounded-lg w-fit mx-auto">
            No more replies
          </p>
        )}
      </div>
    </div>
  );
};

export default ListReplies;
