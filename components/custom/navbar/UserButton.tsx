"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AiFillDashboard } from "react-icons/ai";
import { BiSolidUser } from "react-icons/bi";
import { IoBookmarkSharp } from "react-icons/io5";
import { PiSignOutFill } from "react-icons/pi";
import { SessionProps } from "@/types";
import { signOut } from "next-auth/react";

const UserButton = ({ session }: SessionProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  if (!session) return null;
  const handleClick = (href: string) => {
    setOpen(false);
    router.push(href);
  };
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="cursor-pointer outline-0">
        <Avatar>
          <AvatarImage
            src={session.user.image || ""}
            alt={session.user.name as string}
          />
          <AvatarFallback>
            {session.user.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mt-2 mr-4 w-64 p-2 rounded-md border bg-white shadow-xl">
        <div className="flex flex-col items-center gap-2 py-4 border-b">
          <Avatar className="size-16 border">
            <AvatarImage
              src={session.user.image || ""}
              alt={session.user.name as string}
            />
            <AvatarFallback>
              {session.user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <DropdownMenuLabel className="text-sm font-medium uppercase text-center">
            {session.user.name}
          </DropdownMenuLabel>
        </div>
        <DropdownMenuItem
          className="flex items-center gap-2 px-3 mt-4 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
          onClick={() => handleClick(`/user/${session.user.username}/1`)}
        >
          <BiSolidUser size={20} />
          <span className="text-sm">Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
          onClick={() => handleClick("/blog/new")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              d="m17.5 4.5-8.458 8.458a.25.25 0 0 0-.06.098l-.824 2.47a.25.25 0 0 0 .316.316l2.47-.823a.25.25 0 0 0 .098-.06L19.5 6.5m-2-2 2.323-2.323a.25.25 0 0 1 .354 0l1.646 1.646a.25.25 0 0 1 0 .354L19.5 6.5m-2-2 2 2"
            ></path>
            <path
              fill="currentColor"
              d="M14 4a.5.5 0 0 0 0-1zm7 6a.5.5 0 0 0-1 0zm-7-7H4v1h10zM3 4v16h1V4zm1 17h16v-1H4zm17-1V10h-1v10zm-1 1a1 1 0 0 0 1-1h-1zM3 20a1 1 0 0 0 1 1v-1zM4 3a1 1 0 0 0-1 1h1z"
            ></path>
          </svg>
          <span className="text-sm">Create Article</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
          onClick={() => handleClick("/bookmarks/1")}
        >
          <IoBookmarkSharp size={20} />
          <span className="text-sm">Bookmarks</span>
        </DropdownMenuItem>
        {session.user.role === "ADMIN" && (
          <DropdownMenuItem
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
            onClick={() => handleClick("/admin")}
          >
            <AiFillDashboard size={20} />
            <span className="text-sm">Dashboard</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-50 text-red-600 transition cursor-pointer"
          onClick={() => signOut()}
        >
          <PiSignOutFill size={20} />
          <span className="text-sm font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
