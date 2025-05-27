import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Search from "./Search";
import Notifications from "./Notifications";
import UserButton from "./UserButton";
import { SessionProps } from "@/types";
import { Braces, Monitor } from "lucide-react";
const Navbar = ({ session }: SessionProps) => {
  const isLoggedIn = !!session?.user;
  return (
    <header className="w-full border-b border-gray-200 bg-white h-16 z-50 sticky top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Link
            href="/blog/feed/1"
            className="relative flex items-center justify-center h-16 w-16 hover:opacity-90 transition-opacity"
          >
            <div className="absolute inset-0 m-auto w-12 h-12 rounded-full border-2 border-black" />
            <span
              className="relative z-10 uppercase px-1 text-black mr-[-0.25rem] ml-[-0.25rem] font-semibold text-base select-none bg-white"
            >
              Jspeeps
            </span>
          </Link>
          <Search />
        </div>
        <div className="flex items-center space-x-4">
          <div className="sm:hidden">
            <FiSearch className="text-xl" />
          </div>

          <Link
            href={"/blog/new"}
            className="hidden sm:flex items-center text-sm gap-3 max-sm:gap-2 transition"
          >
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
            <span className={cn("text-base font-normal")}>Write</span>
          </Link>

          {isLoggedIn && <Notifications />}
          {isLoggedIn ? (
            <UserButton session={session} />
          ) : (
            <Link
              href={"/login"}
              className="inline-flex items-center justify-center border align-middle select-none font-medium text-center duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm py-2 px-4 shadow-sm hover:shadow-md bg-stone-800 hover:bg-stone-700 relative bg-gradient-to-b from-stone-700 to-stone-800 border-stone-900 text-stone-50 rounded-full hover:bg-gradient-to-b hover:from-stone-800 hover:to-stone-800 hover:border-stone-900 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_rgba(0,0,0,0.35)] after:pointer-events-none transition antialiased"
            >
              Get started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
