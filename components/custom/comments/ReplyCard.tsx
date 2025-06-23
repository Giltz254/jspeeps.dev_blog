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
  const { activeReplyFormId, setActiveReplyFormId } =
    useCommentsContext();
  const showForm = activeReplyFormId === reply.id;

  return (
    <div className="px-3 sm:px-4 pt-3 pb-4 flex flex-col gap-2">
      <UserSummary
        name={reply.user.name}
        image={reply.user.image}
        createdAt={reply.createdAt}
      />
      <p className="text-slate-800 leading-relaxed text-sm sm:text-base">
        {reply.repliedToUser && (
          <span className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer mr-1">
            @{reply.repliedToUser.name}
          </span>
        )}
        {reply.content}
      </p>
      <CommentReactions
        userId={userId}
        comment={reply}
        isReply={true}
        onReplyCreated={onReplyCreated}
        onReplyDeleted={onReplyDeleted}
      />
      {showForm && userId && (
        <div className="border-l border-slate-300 pl-3 sm:pl-4 mt-2">
          <AddCommentsForm
            blogId={reply.blogId}
            userId={userId}
            parentId={reply.parentId ?? undefined}
            repliedToId={reply.userId}
            placeholder="Add Reply"
            onCommentAdded={onReplyCreated}
            onReplyAdded={onReplyAdded}
            isActive={showForm}
            deactivate={() => setActiveReplyFormId(null)}
          />
        </div>
      )}
    </div>
  );
};

export default ReplyCard;
