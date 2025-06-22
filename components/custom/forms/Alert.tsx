import React from 'react';
import Link from 'next/link';
import { IoShieldCheckmarkSharp } from 'react-icons/io5';
import { IoMdInformationCircle } from "react-icons/io";
import { MdDangerous } from 'react-icons/md';
import { cn } from '@/lib/utils';

interface AlertProps {
  success?: boolean;
  error?: boolean;
  message: string;
  showRedirectLink?: boolean;
}

const Alert = ({ success, error, message, showRedirectLink = false }: AlertProps) => {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl shadow-sm border text-sm transition-all",
        success && "bg-emerald-50 text-emerald-700 border-emerald-200",
        error && "bg-rose-50 text-rose-700 border-rose-200",
        !success && !error && "bg-blue-50 text-blue-700 border-blue-200"
      )}
    >
      <span className="mt-0.5">
        {success && <IoShieldCheckmarkSharp size={20} className="text-emerald-500" />}
        {error && <MdDangerous size={20} className="text-rose-500" />}
        {!success && !error && <IoMdInformationCircle size={20} className="text-blue-500" />}
      </span>
      <div>
        <p className="leading-snug">{message}</p>
        {showRedirectLink && (
          <Link
            href="/blog/feed/1"
            className={cn(
              "inline-block mt-2 font-medium underline",
              error && "text-rose-600 hover:text-rose-700",
              success && "text-emerald-600 hover:text-emerald-700",
              !error && !success && "text-blue-600 hover:text-blue-700"
            )}
          >
            Go to a safe place →
          </Link>
        )}
      </div>
    </div>
  );
};

export default Alert;
