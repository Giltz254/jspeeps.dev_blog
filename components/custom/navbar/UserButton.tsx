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
import { cn } from "@/lib/utils";
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
            src={
              session.user.image ||
              session.user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            }
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
      <DropdownMenuContent className={cn("h-[calc(100vh-64px)] mt-3 border-t-0 min-w-xs")}>
        <div className="flex items-center justify-center flex-col mt-4">
          <Avatar className="size-16 border">
            <AvatarImage
              src={
                session.user.image ||
                session.user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              }
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
          <DropdownMenuLabel className="font-medium uppercase text-base">
            {session.user.name}
          </DropdownMenuLabel>
        </div>
        <DropdownMenuItem className="w-full cursor-pointer" onClick={() => handleClick(`/user/${session.user.username}/1`)}>
          <BiSolidUser size={24} />
          <span className="font-normal text-sm">Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="w-full cursor-pointer" onClick={() => handleClick("/blog/new")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Write"
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
          <span className="font-normal text-sm">Create Article</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="w-full cursor-pointer" onClick={() => handleClick("/bookmarks/1")}>
          <IoBookmarkSharp size={24} />
          <span className="font-normal text-sm">Bookmarked Articles</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="w-full cursor-pointer" onClick={() => handleClick("/admin")}>
          <AiFillDashboard size={24} />
          <span className="font-normal text-sm">Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="w-full cursor-pointer" onClick={() => signOut()}>
          <PiSignOutFill size={24} />
          <span className="font-normal text-base">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
