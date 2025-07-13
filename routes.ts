export const publicRoutes: (string | RegExp)[] = [
  "/",
  "/api/users",
  "/sitemap.xml",
  /^\/blog\/[^/]+$/,
  /^\/\d+$/,
  /^\/blog\/feed(?:\/.*)?$/,
  "/api/blogs",
  /^\/api\/blogs\/[^/]+$/,
  /^\/api\/blogs\/tags\/[^/]+$/,
  /^\/tags\/[^/]+$/,
  "/api/comments",
  /^\/api\/edgestore(?:\/.*)?$/,
  "/api/generate-summary",
  "/api/blogs/slugs",
  "/api/blogs/tags",
  "/jspeeps-privacy-policy",
  "/jspeeps-terms-of-service",
  "/help.jspeeps",
  /^\/api\/blogs\/tags\/[^/]+$/,
  /^\/user\/[^/]+$/,
  /^\/api\/users\/[^/]+$/,
  "/settings/profile",
  /^\/api\/users\/[^/]+\/[^/]+$/,
  /^\/user\/[^/]+\/[^/]+$/,
  /^\/api\/blogs\/feed\/[^/]+$/,
  /^\/tags\/[^/]+\/[^/]+$/,
  /^\/api\/blogs\/tags\/[^/]+\/[^/]+$/,
  /^\/api\/blogs\/bookmarks\/\d+$/,
  "/api/blogs/follow",
  /^\/search\/\d+$/, 
  /^\/api\/search\/\d+$/,
  "/api/notifications",
  /^\/api\/blogs\/[^/]+\/static$/,
  /^\/api\/blogs\/[^/]+\/dynamic$/,
  /^\/api\/blogs\/static\/\d+$/,
  /^\/api\/blogs\/dynamic\/\d+$/,
  /^\/api\/blogs\/tags\/static\/[^/]+\/\d+$/,
  /^\/api\/blogs\/tags\/dynamic\/[^/]+\/\d+$/,
  /^\/api\/users\/[^/]+\/blogs\/static\/\d+$/,
  /^\/api\/users\/[^/]+\/blogs\/dynamic\/\d+$/,
  "/api/blogs/total-pages",
  /^\/api\/blogs\/tags\/total-pages\/[^/]+$/,
  "/api/blogs/featured",
  "/api/blogs/fan-favourites",
  "/jspeeps-support"
];

export const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/new-password",
  "/auth-error",
];

export const protectedRoutes: (string | RegExp)[] = [
  "/blog/new",
  "/signout",
  "/api/admin/blogs",
];

export const apiAuthPrefix = "/api/auth";

export const LOGIN_REDIRECT = "/blog/feed/1";
