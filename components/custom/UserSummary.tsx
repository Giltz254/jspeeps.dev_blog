"use client"
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
    <div className="flex items-start justify-start gap-2">
      <Avatar>
        <AvatarImage src={image || getInitials(name)} />
        <AvatarFallback>
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium capitalize text-gray-700">
        {name}
      </span>
      <span className="text-sm font-medium text-gray-700">
        {formatTimeFromNow(createdAt)}
      </span>
    </div>
  );
};

export default UserSummary;
