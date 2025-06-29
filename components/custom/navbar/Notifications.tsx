"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatTimeFromNow } from "@/lib/utils";
import { BsBell } from "react-icons/bs";
import { Loader2 } from "lucide-react";
import { markNotificationAsRead } from "@/actions/notifications/markNotificationAsRead";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/custom/layout/Toasts";
import { fetchNotificationsFromApi } from "@/lib/notifications-fetch";
interface Notification {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  type: string;
}

interface NotificationsProps {
  initialUnreadCount: number;
  initialCountError: string | null;
}

const Notifications = ({
  initialUnreadCount,
  initialCountError,
}: NotificationsProps) => {
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [countError] = useState<string | null>(initialCountError);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = useCallback(
    async (cursor?: string | null) => {
      if (isLoadingNotifications || (cursor && !hasMore)) return;
      setIsLoadingNotifications(true);
      try {
        const data = await fetchNotificationsFromApi(cursor);
        if (data.error) {
          console.error("Error fetching notifications via helper:", data.error);
          showErrorToast(data.error);
          setNotifications([]);
          setHasMore(false);
        } else {
          setNotifications((prev) => [...prev, ...data.notifications]);
          setNextCursor(data.nextCursor);
          setHasMore(data.hasMore);
          setUnreadCount(data.unreadCount);
        }
      } catch (error) {
        console.error(
          "Unexpected error in fetchNotifications callback:",
          error
        );
        showErrorToast(
          "An unexpected error occurred while fetching notifications."
        );
        setNotifications([]);
        setHasMore(false);
      } finally {
        setIsLoadingNotifications(false);
      }
    },
    [isLoadingNotifications, hasMore]
  );
  useEffect(() => {
    if (
      isOpen &&
      notifications.length === 0 &&
      !isLoadingNotifications &&
      initialUnreadCount > 0
    ) {
      fetchNotifications();
    }
    if (isOpen && initialUnreadCount === 0 && notifications.length === 0) {
      setHasMore(false);
    }
  }, [
    isOpen,
    notifications.length,
    isLoadingNotifications,
    fetchNotifications,
    initialUnreadCount,
  ]);

  const handleLoadMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nextCursor && hasMore && !isLoadingNotifications) {
      fetchNotifications(nextCursor);
    }
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markNotificationAsRead(undefined, true).then((res) => {
        if (res.error) {
          console.error("Error marking all as read:", res.error);
          showErrorToast(res.error);
        }
        if (res.success) {
          setUnreadCount(0);
          setNotifications((prev) =>
            prev.map((notif) => ({ ...notif, isRead: true }))
          );
          showSuccessToast("All notifications marked as read!");
        }
      });
    } catch (error) {
      console.error("Client-side error marking all as read:", error);
      showErrorToast("Failed to mark all as read due to a network error.");
    }
  };
  const handleNotificationClick = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));

    try {
      const result = await markNotificationAsRead(notificationId, false);
      if (result.error) {
        showErrorToast(result.error);
        setUnreadCount((prev) => prev + 1);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, isRead: false } : notif
          )
        );
      } if (result.success) {
        showSuccessToast(result.message || "Notification marked as read!");
      }
    } catch (error) {
      console.error("Client-side error marking notification as read:", error);
      showErrorToast(
        "Failed to mark notification as read due to a network error."
      );
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: false } : notif
        )
      );
    }
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="outline-0 cursor-pointer relative">
        {!countError && unreadCount > 0 && (
          <div className="absolute bg-emerald-500 text-white h-6 w-6 rounded-full text-sm flex items-center justify-center left-2 bottom-2 font-medium">
            <span>{unreadCount}</span>
          </div>
        )}
        {countError && (
          <span
            className="absolute text-red-500 left-3 bottom-2 text-xs"
            title={countError}
          >
            !
          </span>
        )}
        <BsBell size={20} className="" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(
          "h-[calc(100vh-64px)] mt-4.5 border-t-0 w-80 max-w-xs overflow-hidden"
        )}
      >
        <div className="flex items-center justify-between gap-4 p-2">
          <DropdownMenuLabel className="font-medium text-base">
            Notifications
          </DropdownMenuLabel>
          <Button
            variant={"link"}
            className="cursor-pointer"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        </div>
        <DropdownMenuSeparator />
        <div className="overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
          {isLoadingNotifications &&
          notifications.length === 0 &&
          unreadCount > 0 ? (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : notifications.length === 0 && !hasMore ? (
            <DropdownMenuItem className="text-gray-500 justify-center">
              No notifications yet.
            </DropdownMenuItem>
          ) : (
            notifications.map((notification, index) => ( // Added index for the conditional mb
  <DropdownMenuItem
    key={notification.id}
    className={cn(
      // Base styles for all notification items
      "flex flex-col items-start px-4 py-3 cursor-pointer rounded-md transition-colors duration-200",
      // Add margin-bottom for a gap between items (excluding the last one)
      { "mb-2": index < notifications.length - 1 }, // Adds a 0.5rem gap between items

      // Conditional styles for read/unread state
      {
        // Unread notification: subtle gradient from a darker base AND a border
        "bg-gradient-to-r from-gray-50 via-white to-white hover:bg-gray-100": !notification.isRead,
        "border border-gray-300": !notification.isRead, // Subtle gray border for unread
        // Consider a subtle shadow for unread to make it stand out more
        // "shadow-sm": !notification.isRead, // Optional: add a small shadow for unread

        // Read notification: clean white background
        "bg-white hover:bg-gray-50": notification.isRead,
      }
    )}
    onClick={() => handleNotificationClick(notification.id)}
  >
    {/* Notification Content - Stronger black tone for primary text */}
    <div className="text-sm font-medium leading-snug text-gray-900 mb-1.5">
      {notification.content}
    </div>
    {/* Timestamp - Consistent secondary gray tone */}
    <p className="text-xs text-gray-500">
      {formatTimeFromNow(new Date(notification.createdAt))}
    </p>
  </DropdownMenuItem>
))
          )}

          {/* Show Load More button only if there is a next cursor and hasMore is true, and not currently loading */}
          {nextCursor &&
            hasMore &&
            !isLoadingNotifications &&
            notifications.length > 0 && (
              <DropdownMenuItem className="flex justify-center">
                <Button
                  onClick={handleLoadMore}
                  variant="ghost"
                  className="w-full"
                >
                  Load More
                </Button>
              </DropdownMenuItem>
            )}
          {isLoadingNotifications &&
            nextCursor &&
            hasMore &&
            notifications.length > 0 && (
              // Show loader for subsequent "Load More" calls
              <DropdownMenuItem className="flex justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading
                More...
              </DropdownMenuItem>
            )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
