"use client";

import { cn } from "@/lib/utils";
import { CommentWithUser } from "./ListComments";
import { useEffect, useState } from "react";
import { FaHandsClapping } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa";
import { PiHandsClapping } from "react-icons/pi";
import { clapComment } from "@/actions/comments/clap-comment";
import { deleteComment } from "@/actions/comments/delete-comment";
import { ChevronDown } from "lucide-react";
import { useCommentsContext } from "./CommentsContext";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "../layout/Toasts";
import CustomDropdown from "./CustomDropdown";
import { BsReply } from "react-icons/bs";

interface CommentReactionsProps {
  comment: CommentWithUser;
  isReply?: boolean;
  onReplyCreated?: () => void;
  onReplyDeleted?: (id: string) => void;
  userId?: string;
}

const CommentReactions = ({
  comment,
  isReply,
  onReplyCreated,
  onReplyDeleted,
  userId,
}: CommentReactionsProps) => {
  const [clapCount, setClapCount] = useState(comment._count.claps);
  const {
    activeRepliesId,
    setActiveRepliesId,
    replyCountMap,
    setReplyCountForComment,
    activeReplyFormId,
    setActiveReplyFormId,
  } = useCommentsContext();
  useEffect(() => {
    setReplyCountForComment(comment.id, comment._count.replies);
  }, []);
  const replyCount = replyCountMap[comment.id] || 0;
  const [userHasClapped, setUserHasClapped] = useState(
    !!comment.claps.length && !!userId
  );
  const [isClapping, setIsClapping] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const showReplies = activeRepliesId === comment.id;
  const handleReply = () => {
    if (!userId) {
      showInfoToast("Sign in to add a comment.");
      return;
    }

    if (activeReplyFormId === comment.id) {
      setActiveReplyFormId(null);
    } else {
      setActiveReplyFormId(comment.id);
    }
  };

  const handleShowReplies = () => {
    if (showReplies) {
      setActiveRepliesId(null);
      setActiveReplyFormId(null);
    } else {
      setActiveRepliesId(comment.id);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (userId) {
        const res = await deleteComment(comment.id);
        if (res.success) {
          onReplyCreated?.();
          onReplyDeleted?.(comment.id);
          showSuccessToast(res.success);
        }
        if (res.error) {
          showErrorToast(res.error);
        }
      }
    } catch (error) {
      setIsDeleting(false);
      showErrorToast("Something went wrong! Please check your network.");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleClap = async () => {
    if (!userId || isClapping) return;
    setIsClapping(true);
    try {
      setClapCount((prevCount) =>
        userHasClapped ? prevCount - 1 : prevCount + 1
      );
      setUserHasClapped((prevState) => !prevState);
      await clapComment(comment.id, userId);
    } catch (error) {
      setIsClapping(false);
    } finally {
      setIsClapping(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-row justify-between gap-2 sm:gap-4 w-full text-sm mt-2",
        isReply && "ml-2"
      )}
    >
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleClap}
          disabled={isClapping}
          className="flex items-center gap-1 cursor-pointer"
        >
          {userHasClapped ? (
            <FaHandsClapping size={20} />
          ) : (
            <PiHandsClapping size={20} />
          )}{" "}
          {clapCount}
        </button>
        {replyCount > 0 && !isReply && (
          <span
            onClick={handleShowReplies}
            className="flex items-center whitespace-nowrap gap-1 cursor-pointer text-sm"
          >
            <FaRegComment size={18} />
            <span className="bg-sky-100 text-sky-800 hover:bg-sky-200 transition duration-300 px-3 py-1 rounded-full flex items-center gap-1 font-normal text-sm border border-sky-200">
              {replyCount} {replyCount === 1 ? "Reply" : "Replies"}
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  showReplies ? "rotate-180" : ""
                }`}
              />
            </span>
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 justify-end">
        <BsReply onClick={handleReply} size={20} className="cursor-pointer" />
        {userId && userId === comment.userId && (
          <CustomDropdown
            showDelete={userId === comment.userId}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </div>
  );
};

export default CommentReactions;
