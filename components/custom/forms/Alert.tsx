import React from "react";
import Link from "next/link";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { IoMdInformationCircle } from "react-icons/io";
import { MdDangerous } from "react-icons/md";
import { cn } from "@/lib/utils";

interface AlertProps {
  success?: boolean;
  error?: boolean;
  message: string;
  showRedirectLink?: boolean;
}

const Alert = ({
  success,
  error,
  message,
  showRedirectLink = false,
}: AlertProps) => {
  return (
    <div className="h-[calc(100vh-64px)] w-full flex items-center justify-center bg-white px-4">
      <div
        className={cn(
          "w-full max-w-md p-6 rounded-2xl shadow-lg border transition-all text-center space-y-4",
          success && "bg-emerald-50 text-emerald-800 border-emerald-200",
          error && "bg-rose-50 text-rose-800 border-rose-200",
          !success && !error && "bg-blue-50 text-blue-800 border-blue-200"
        )}
      >
        <div className="flex justify-center">
          {success && (
            <IoShieldCheckmarkSharp size={40} className="text-emerald-500" />
          )}
          {error && <MdDangerous size={40} className="text-rose-500" />}
          {!success && !error && (
            <IoMdInformationCircle size={40} className="text-blue-500" />
          )}
        </div>
        <p className="text-lg font-semibold leading-snug">{message}</p>
        {showRedirectLink && (
          <Link
            href="/blog/feed/1"
            className={cn(
              "inline-block text-sm font-medium underline underline-offset-2 transition",
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
