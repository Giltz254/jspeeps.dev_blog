import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Search from "./Search";
import Notifications from "./Notifications";
import UserButton from "./UserButton";
import { SessionProps } from "@/types";
const Navbar = ({ session }: SessionProps) => {
  const isLoggedIn = !!session?.user;
  return (
    <header className="w-full border-b border-gray-200 bg-white h-16 z-50 sticky top-0 left-0 font-[family-name:var(--font-eb-garamond)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/blog/feed/1"
            className="relative flex items-center justify-center h-16 w-16 hover:opacity-90 transition-opacity font-[family-name:var(--font-lora)]"
          >
            <div className="absolute inset-0 m-auto w-12 h-12 rounded-full border-2 border-black" />
            <span className="relative z-10 uppercase px-1 text-black mr-[-0.25rem] ml-[-0.25rem] font-semibold text-base select-none bg-white">
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
              href="/login"
              className="inline-block px-5 py-2.5 text-white text-sm font-medium rounded-md shadow-sm transition duration-300 ease-in-out
             bg-gradient-to-r from-slate-500 via-blue-500 to-blue-600
             hover:from-slate-600 hover:via-blue-600 hover:to-blue-700
             focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
