"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { BsBell } from "react-icons/bs";

const Notifications = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-0 cursor-pointer relative">
        <div className="absolute bg-emerald-500 text-white h-6 w-6 rounded-full text-sm flex items-center justify-center left-2 bottom-2 font-medium">
          <span>5</span>
        </div>
        <BsBell size={20} className="" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn("h-[calc(100vh-64px)] mt-4.5 border-t-0")}
      >
        <div className="flex items-center justify-between gap-4">
          <DropdownMenuLabel className="font-medium text-base">
            Notifications
          </DropdownMenuLabel>
          <Button variant={"link"} className="cursor-pointer">
            Mark all as read
          </Button>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="max-w-xs">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, voluptatibus?
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
