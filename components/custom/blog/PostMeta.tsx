'use client';
import formatDate from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

interface PostMetaProps {
  author: string;
  avatar: string;
  readTime: string;
  date: Date;
}

const PostMeta = ({ author, avatar, readTime, date }: PostMetaProps) => {
  const [isFollowing, setIsFollowing] = useState(true);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-stone-600">
      <div className="flex items-center gap-2">
        <Image
          src={avatar}
          alt={author}
          width={32}
          height={32}
          className="rounded-full w-8 h-8 object-cover border border-border"
        />
        <span className="font-medium text-stone-800">{author}</span>
      </div>
      <button
        onClick={() => setIsFollowing(!isFollowing)}
        className="border cursor-pointer border-stone-300 text-stone-800 rounded-full px-3 py-1 hover:bg-stone-100 transition flex items-center gap-1"
      >
        {isFollowing ? 'Following' : 'Follow'}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <span className="hidden sm:inline">•</span>
      <span>{readTime}</span>
      <span className="hidden sm:inline">•</span>
      <span>{formatDate(date)}</span>
    </div>
  );
};

export default PostMeta;
