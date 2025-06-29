import { fetchStaticBlogData } from "./fetchStaticBlogData";
import { fetchDynamicBlogData } from "./fetchDynamicBlogData"

export async function fetchAllBlogDataInParallel(slug: string): Promise<{
  blog: any;
  relatedBlogs: any[];
  dynamic: { clapsCount: number; commentsCount: number; hasClapped: boolean; hasBookmarked: boolean };
}> {
  if (!slug) {
    throw new Error("Blog identifier (slug or ID) is required.");
  }

  try {
    const [staticData, dynamicData] = await Promise.all([
      fetchStaticBlogData(slug), 
      fetchDynamicBlogData(slug),
    ]);
    if (!staticData || !staticData.blog || !dynamicData) {
        throw new Error("Failed to fetch complete blog data. One or more parts are missing.");
    }
    return {
      blog: staticData.blog,
      relatedBlogs: staticData.relatedBlogs,
      dynamic: dynamicData,
    };
  } catch (error) {
    console.error(`fetchAllBlogDataInParallel: Failed to fetch all blog data for ${slug}:`, error);
    return {
      blog: null,
      relatedBlogs: [],
      dynamic: { clapsCount: 0, commentsCount: 0, hasClapped: false, hasBookmarked: false },
    };
  }
}