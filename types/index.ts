import { CommentWithUser } from "@/components/custom/comments/ListComments";
import { Session as AuthSession } from "@auth/core/types";

export interface SessionProps {
  session: AuthSession | null;
}
export type Blog = {
  id: string;
  title: string;
  description: string;
  summary: string | null;
  coverImage: string | null;
  featured: Boolean;
  user: {
    name: string;
    id: string;
  };
  isPublished: boolean;
  createdAt: Date;
  slug: string;
  tags: string[];
};

export type GetCommentsSuccess = {
  success: {
    comments: CommentWithUser[];
    hasMore: boolean;
  };
};

export type GetCommentsError = {
  error: string;
};

export type GetCommentsResponse = GetCommentsSuccess | GetCommentsError;

export function isSuccess(res: GetCommentsResponse): res is GetCommentsSuccess {
  return "success" in res;
}
interface NotificationSender {
  id: string;
  name: string;
}
interface NotificationBlog {
  id: string;
  title: string;
}
interface NotificationComment {
  id: string;
  content: string;
  blogId: string;
}
interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  type: "NEW_COMMENT"  | "COMMENT_REPLY" | "NEW_CLAP" | "FOLLOW" | "SYSTEM_ALERT";
  blogId: string | null;
  commentId: string | null;
  entityType: "BLOG" | "COMMENT" | "USER" | "SYTEM";
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: NotificationSender;
  blog: NotificationBlog | null;
  comment: NotificationComment | null;
}
export interface FetchNotificationsResponse {
  notifications: Notification[];
  nextCursor: string | null;
  hasMore: boolean;
  error?: string;
  unreadCount: number;
}
export type BlogSummary = {
  id: string;
  slug: string;
  title: string;
  coverImage?: string;
  readtime: number;
  createdAt: Date;
  description: string;
  user: {
    name: string;
    id: string,
    image?: string;
  }
  _count: {
    claps: number;
    comments: number;
  };
};