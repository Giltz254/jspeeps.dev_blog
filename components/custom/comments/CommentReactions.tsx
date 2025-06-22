"use client";

import { cn } from "@/lib/utils";
import { CommentWithUser } from "./ListComments";
import { useEffect, useState } from "react";
import { FaHandsClapping } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa";
import { BsReply } from "react-icons/bs";
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
        "flex justify-between items-center w-full text-sm mt-2 gap-4",
        isReply && "justify-start ml-2"
      )}
    >
      <div className="flex items-center gap-4">
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
            <span className="bg-sky-100 text-sky-800 hover:bg-sky-200 transition duration-300 px-3 py-1 rounded-full flex items-center gap-1 font-medium shadow-sm border border-sky-200">
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
      <div className="flex flex-wrap items-center">
        <span
          onClick={handleReply}
          className="flex items-center gap-1 cursor-pointer mr-4"
        >
          <BsReply size={20} />
          Reply
        </span>
        {userId === comment.userId && (
          <button
            disabled={isDeleting}
            onClick={handleDelete}
            className="relative bg-transparent disabled:cursor-not-allowed border-none group cursor-pointer"
          >
            <svg
              viewBox="0 0 15 17.5"
              height="17.5"
              width="15"
              xmlns="http://www.w3.org/2000/svg"
              className="transform scale-120 transition-transform duration-200 linear group-hover:scale-150"
            >
              <path
                transform="translate(-2.5 -1.25)"
                d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z"
                id="Fill"
                className="group-hover:fill-red-700"
              ></path>
            </svg>
            <div className="absolute -top-[130%] left-1/2 -translate-x-1/2 w-fit h-fit bg-red-700 px-2 py-1 transition-all duration-200 linear delay-200 text-white capitalize rounded-md text-xs opacity-0 invisible group-hover:visible group-hover:opacity-100 group-hover:-top-[160%]">
              delete
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentReactions;
