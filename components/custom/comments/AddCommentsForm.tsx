"use client";
import { Button } from "@/components/ui/button";
import { CommentSchema, CommentSchemaType } from "@/schemas/CommentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useTransition } from "react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import TextAreaField from "./TextAreaField";
import { addComment } from "@/actions/comments/add-comment";
import { createNotification } from "@/actions/notifications/createNotification";
// import { useSocket } from "@/context/SocketContext";
import { CommentWithUser } from "./ListComments";
import { SendHorizonal } from "lucide-react";
import { showErrorToast, showSuccessToast } from "../layout/Toasts";
interface AddCommentsProps {
  blogId: string;
  creatorId?: string;
  userId?: string;
  placeholder?: string;
  parentId?: string;
  repliedToId?: string;
  onCommentAdded?: () => void;
  onReplyAdded?: (newReply: CommentWithUser) => void;
  isActive?: boolean;
  deactivate?: () => void;
}
const AddCommentsForm = ({
  blogId,
  creatorId,
  userId,
  placeholder,
  parentId,
  repliedToId,
  onCommentAdded,
  isActive,
  onReplyAdded,
  deactivate,
}: AddCommentsProps) => {
  const [isPending, startTransition] = useTransition();
  // const { sendNotification } = useSocket();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentSchemaType>({
    resolver: zodResolver(CommentSchema),
  });
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (isActive && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isActive]);
  const onSubmit: SubmitHandler<CommentSchemaType> = (data) => {
    startTransition(() => {
      addComment({
        values: data,
        userId,
        blogId,
        parentId,
        repliedToUserId: repliedToId,
      }).then(async (res) => {
        if (res.error) return showErrorToast(res.error);
        if (res.success) {
          if (deactivate) deactivate();
          onReplyAdded?.(res.success.comment);
          onCommentAdded?.();
          if (repliedToId) {
            await createNotification({
              recipientId: repliedToId,
              type: "COMMENT_REPLY",
              commentId: parentId,
              entityType: "COMMENT",
              content: data.content,
            });
            // sendNotification(repliedToId, userId);
          }
          if (creatorId) {
            await createNotification({
              recipientId: creatorId,
              type: "NEW_COMMENT",
              blogId,
              entityType: "BLOG",
              content: data.content,
            });
            // sendNotification(creatorId, userId);
          }
          showSuccessToast(res.success.message);
          reset();
        }
      });
    });
  };
  const onError = (errors: FieldErrors<CommentSchemaType>) => {
    Object.values(errors).forEach((error) => {
      if (error?.message) {
        showErrorToast(error.message);
      }
    });
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(onSubmit, onError)();
    } else if (event.key === "Enter" && event.shiftKey) {
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="relative">
      <div className="relative p-0 md:p-4 md:border md:border-slate-300 md:bg-gradient-to-br md:from-slate-50 md:to-slate-100 md:rounded-full md:shadow-sm">
        <TextAreaField<{ content: string }>
          id="content"
          register={register}
          ref={textareaRef}
          errors={errors}
          disabled={isPending || !userId}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? "Add a comment..."}
          inputClassNames="w-full resize-none pe-12 pl-4 py-3 text-sm bg-white rounded-full border md:border-0 text-slate-700 placeholder-slate-400 focus:ring-slate-400 focus:border-slate-400"
        />
        <Button
          disabled={isPending || !userId}
          type="submit"
          className="absolute cursor-pointer top-1/2 -translate-y-1/2 right-0 md:right-4 bg-slate-500 hover:bg-slate-600 text-white w-10 h-10 rounded-full shadow transition flex items-center justify-center"
        >
          {isPending ? (
            <span className="text-sm">...</span>
          ) : (
            <SendHorizonal className="w-4 h-4" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddCommentsForm;
