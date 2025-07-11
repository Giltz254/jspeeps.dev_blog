import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Search from "./Search";
import Notifications from "./Notifications";
import UserButton from "./UserButton";
import { SessionProps } from "@/types";
import { getNotificationCount } from "@/actions/notifications/notificationCount";
import { Award } from "lucide-react";
const Navbar = async ({ session }: SessionProps) => {
  const isLoggedIn = !!session?.user;
  let initialUnreadCount = 0;
  let initialCountError: string | null = null;
  if (isLoggedIn) {
    const countResult = await getNotificationCount();
    if (countResult.error) {
      console.error(
        "Server Navbar: Error fetching initial unread count:",
        countResult.error
      );
      initialCountError = countResult.error;
    } else if (countResult.count !== undefined) {
      initialUnreadCount = countResult.count;
    }
  }
  return (
    <header className="w-full border-b border-border bg-white h-16 z-50 sticky top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/blog/feed/1"
            className="relative flex shadow-sm border-2 border-[#102E50] rounded-full items-center justify-center group h-16 w-16 hover:opacity-90 transition-opacity"
          >
            <div className="absolute inset-0 m-auto w-12 h-12 rounded-full border-[3px] border-gray-400" />

            <span
              className="relative z-10 uppercase px-1 py-[0.1rem] text-black font-bold text-base select-none bg-white rounded-md shadow-sm 
                             border-2 border-[#102E50] group-hover:border-blue-500 transition-colors duration-1000 ease-in-out"
            >
              Jspeeps
            </span>
            <Award
              className="absolute -z-10 text-blue-900 transform bottom-[-0.1rem] left-1/2 -translate-x-1/2"
              size={60}
            />
          </Link>
          <Search isNavbar={true} />
        </div>
        <div className="flex items-center space-x-4">
          <Link href={"/search/1"} className="sm:hidden">
            <FiSearch className="text-xl" />
          </Link>

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

          {isLoggedIn && (
            <Notifications
              initialUnreadCount={initialUnreadCount}
              initialCountError={initialCountError}
            />
          )}
          {isLoggedIn ? (
            <UserButton session={session} />
          ) : (
            <div className="relative inline-block group">
              <div className="absolute left-1 top-1 w-full h-full bg-black -z-10 transition-all duration-300 group-hover:left-0 group-hover:top-0" />
              <Link
                href="/login"
                className="inline-block px-5 py-2.5 text-white text-sm font-medium shadow-sm transition duration-300 ease-in-out
      bg-gradient-to-r from-slate-500 via-blue-500 to-blue-600
      hover:from-slate-600 hover:via-blue-600 hover:to-blue-700
      focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
