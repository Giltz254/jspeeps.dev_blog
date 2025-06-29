import { FetchNotificationsResponse } from "@/types";

export const fetchNotificationsFromApi = async (
  cursor: string | null = null,
  limit: number = 10
): Promise<FetchNotificationsResponse> => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications`);
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }
    url.searchParams.set("limit", limit.toString());
    const response = await fetch(url.toString(), {
        next: {
            tags: ["notifications"]
        }
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `Failed to fetch notifications: ${response.statusText}`);
    }
    const data: FetchNotificationsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchNotificationsFromApi:", error);
    return {
      notifications: [],
      nextCursor: null,
      hasMore: false,
      unreadCount: 0,
      error: (error as Error).message || "Failed to fetch notifications",
    };
  }
};