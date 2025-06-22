import { useState } from "react";
import CommentReactions from "./CommentReactions";
import { CommentWithUser } from "./ListComments";
import AddCommentsForm from "./AddCommentsForm";
import UserSummary from "../UserSummary";
import { useCommentsContext } from "./CommentsContext";

const ReplyCard = ({
  reply,
  onReplyCreated,
  onReplyAdded,
  onReplyDeleted,
  userId,
}: {
  reply: CommentWithUser;
  onReplyCreated: () => void;
  onReplyAdded?: (newReply: CommentWithUser) => void;
  onReplyDeleted?: (id: string) => void;
  userId?: string;
}) => {
  const { activeReplyFormId, handleReplyCreated, setActiveReplyFormId } =
    useCommentsContext();
  const showForm = activeReplyFormId === reply.id;
  return (
    <div className="p-4 pr-0 flex flex-col gap-2">
      <UserSummary
        name={reply.user.name}
        image={reply.user.image}
        createdAt={reply.createdAt}
      />
      <p>
        {reply.repliedToUser && (
          <span className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
            @{reply.repliedToUser.name}
          </span>
        )}{" "}
        {reply.content}
      </p>
      <CommentReactions
        userId={userId}
        comment={reply}
        isReply={true}
        onReplyCreated={onReplyCreated}
        onReplyDeleted={onReplyDeleted}
      />
      {showForm && (
        <div className="border-l pl-2 my-2 ml-4">
          {userId && showForm && (
            <AddCommentsForm
              blogId={reply.blogId}
              userId={userId}
              parentId={reply.parentId ? reply.parentId : undefined}
              repliedToId={reply.userId}
              placeholder="Add Reply"
              onCommentAdded={onReplyCreated}
              onReplyAdded={onReplyAdded}
              isActive={showForm}
              deactivate={() => setActiveReplyFormId(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReplyCard;
