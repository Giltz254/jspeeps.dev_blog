import { getPublishedBlogsSlugs } from "@/actions/blogs/get-published-blogs-slug";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPublishedBlogsSlugs();
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  if (slugs && slugs.length > 0) {
    dynamicRoutes = slugs.map(({ slug, updatedAt }) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`,
      lastModified: new Date(updatedAt),
      changeFrequency: "monthly",
    }));
  }

  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/feed/1`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
    ...dynamicRoutes,
  ];
}
