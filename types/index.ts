import { CommentWithUser } from '@/components/custom/comments/ListComments';
import { Session as AuthSession } from '@auth/core/types';

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
  }
  isPublished: boolean;
  createdAt: Date;
  slug: string;
  tags: string[];
}

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

export function isSuccess(
  res: GetCommentsResponse
): res is GetCommentsSuccess {
  return "success" in res;
}
