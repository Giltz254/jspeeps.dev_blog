"use client";
import { formatTimeFromNow } from "@/lib/utils";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
interface UserSummaryProps {
  name: string | null;
  image: string | null;
  createdAt: Date;
}
const UserSummary = ({ name, image, createdAt }: UserSummaryProps) => {
  const getInitials = (name: string | null) => {
    if (name) {
      return name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
  };

  return (
    <div className="flex items-start gap-3">
      <Avatar className="w-8 h-8 mt-0.5">
        <AvatarImage src={image || undefined} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-semibold capitalize text-gray-800 leading-tight">
          {name}
        </span>
        <span className="text-xs text-gray-500">
          {formatTimeFromNow(createdAt)}
        </span>
      </div>
    </div>
  );
};

export default UserSummary;
