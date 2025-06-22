"use client";
import { CommentWithUser } from "./ListComments";
import AddCommentsForm from "./AddCommentsForm";
import CommentReactions from "./CommentReactions";
import ListReplies from "./ListReplies";
import UserSummary from "../UserSummary";
import { useCommentsContext } from "./CommentsContext";

const CommentCard = ({
  comment,
  onReplyCreated,
  userId,
}: {
  comment: CommentWithUser;
  onReplyCreated: () => void;
  userId?: string;
}) => {
  const {
    handleReplyCreated,
    activeRepliesId,
    activeReplyFormId,
    setActiveReplyFormId,
  } = useCommentsContext();
  const showReplies = activeRepliesId === comment.id;
  const showForm = activeReplyFormId === comment.id;
  return (
    <div className="p-4 flex flex-col gap-2 mt-6">
      <UserSummary
        name={comment.user.name}
        createdAt={comment.createdAt}
        image={comment.user.image}
      />
      <p>{comment.content}</p>
      <CommentReactions
        onReplyCreated={onReplyCreated}
        comment={comment}
        userId={userId}
      />

      {(showForm || showReplies) && (
        <div className="pl-2 my-2 ml-4">
          {userId && showForm && (
            <AddCommentsForm
              blogId={comment.blogId}
              userId={userId}
              parentId={comment.id}
              repliedToId={comment.userId}
              placeholder="Add Reply"
              onCommentAdded={onReplyCreated}
              onReplyAdded={(reply) => handleReplyCreated(comment.id, reply)}
              isActive={showForm}
              deactivate={() => setActiveReplyFormId(null)}
            />
          )}
          {showReplies && (
            <ListReplies
              comment={comment}
              userId={userId}
              onReplyCreated={onReplyCreated}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
