"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CommentWithUser } from "./ListComments";

type RepliesMap = {
  [commentId: string]: CommentWithUser[];
};

type ReplyCountMap = {
  [commentId: string]: number;
};

type CommentsContextType = {
  repliesMap: RepliesMap;
  setRepliesMap: React.Dispatch<React.SetStateAction<RepliesMap>>;
  handleReplyCreated: (commentId: string, reply: CommentWithUser) => void;
  handleReplyDeleted: (commentId: string, replyId: string) => void;
  activeRepliesId: string | null;
  setActiveRepliesId: React.Dispatch<React.SetStateAction<string | null>>;
  replyCountMap: ReplyCountMap;
  setReplyCountForComment: (commentId: string, count: number) => void;
  incrementReplyCount: (commentId: string) => void;
  decrementReplyCount: (commentId: string) => void;
  activeReplyFormId: string | null;
  setActiveReplyFormId: React.Dispatch<React.SetStateAction<string | null>>;
};
const CommentsContext = createContext<CommentsContextType | undefined>(undefined);
export const CommentsProvider = ({ children }: { children: ReactNode }) => {
  const [repliesMap, setRepliesMap] = useState<RepliesMap>({});
  const [activeRepliesId, setActiveRepliesId] = useState<string | null>(null);
  const [replyCountMap, setReplyCountMap] = useState<ReplyCountMap>({});
  const [activeReplyFormId, setActiveReplyFormId] = useState<string | null>(null);
  const setReplyCountForComment = (commentId: string, count: number) => {
    setReplyCountMap((prev) => ({ ...prev, [commentId]: count }));
  };
  const incrementReplyCount = (commentId: string) => {
    setReplyCountMap((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || 0) + 1,
    }));
  };
  const decrementReplyCount = (commentId: string) => {
    setReplyCountMap((prev) => ({
      ...prev,
      [commentId]: Math.max(0, (prev[commentId] || 0) - 1),
    }));
  };
  const handleReplyCreated = (commentId: string, reply: CommentWithUser) => {
    setRepliesMap((prev) => ({
      ...prev,
      [commentId]: [reply, ...(prev[commentId] || [])],
    }));
    incrementReplyCount(commentId);
  };
  const handleReplyDeleted = (commentId: string, replyId: string) => {
    setRepliesMap((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || []).filter((r) => r.id !== replyId),
    }));
    decrementReplyCount(commentId);
  };

  return (
    <CommentsContext.Provider
      value={{
        repliesMap,
        setRepliesMap,
        handleReplyCreated,
        handleReplyDeleted,
        activeRepliesId,
        setActiveRepliesId,
        replyCountMap,
        setReplyCountForComment,
        incrementReplyCount,
        decrementReplyCount,
        activeReplyFormId,
        setActiveReplyFormId,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
};

export const useCommentsContext = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error("useCommentsContext must be used within CommentsProvider");
  }
  return context;
};
