import { ArtcleCardProps } from "@/components/custom/blog/ArtcleCard";

type SearchSuccessResponse = {
  success: {
    blogs: ArtcleCardProps[];
    hasMore: boolean;
    totalCount: number;
  };
};

export type SearchFetchStatus =
  | { status: "success"; blogs: ArtcleCardProps[]; hasMore: boolean; totalCount: number }
  | { status: "no-results" }
  | { status: "invalid-data" }
  | { status: "error"; message: string }
  | { status: "rate-limited"; reason?: string }
  | { status: "bot-denied"; reason?: string };

export async function fetchSearchResults({
  query,
  page = 1,
  limit = 10,
}: {
  query: string;
  page?: number;
  limit?: number;
}): Promise<SearchFetchStatus> {
  try {
    const params = new URLSearchParams({
      query,
      limit: String(limit),
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/search/${page}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          tags: ["blogs"],
        },
        cache: "force-cache",
      }
    );

    // Handle Arcjet-specific status codes
    if (res.status === 429) {
      const { reason } = await res.json();
      return { status: "rate-limited", reason: reason?.code || "Too many requests" };
    }

    if (res.status === 403) {
      const { reason } = await res.json();
      if (reason?.code === "BOT") {
        return { status: "bot-denied", reason: reason.code };
      }
      return { status: "error", message: "Access denied." };
    }

    if (!res.ok) {
      console.error("Search failed:", res.statusText);
      return { status: "error", message: "Search request failed." };
    }

    const data = (await res.json()) as SearchSuccessResponse;

    if (!data.success || !Array.isArray(data.success.blogs)) {
      console.warn("Unexpected response format:", data);
      return { status: "invalid-data" };
    }

    if (data.success.blogs.length === 0) {
      return { status: "no-results" };
    }

    return {
      status: "success",
      blogs: data.success.blogs,
      hasMore: data.success.hasMore,
      totalCount: data.success.totalCount,
    };
  } catch (error) {
    console.error("Error during search fetch:", error);
    return {
      status: "error",
      message: "Network or server error during search.",
    };
  }
}
