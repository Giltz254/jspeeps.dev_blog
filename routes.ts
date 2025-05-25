export const publicRoutes: (string | RegExp)[] = [
  "/",
  "/sitemap.xml",
  /^\/blog\/[^/]+$/,
  /^\/\d+$/,
  /^\/blog\/feed(?:\/.*)?$/
];

export const authRoutes = ["/login", "/register", "/forgot-password", "/new-password", "/auth-error"];

export const protectedRoutes: (string | RegExp)[] = [
  "/blog/new",
  "/signout"
];

export const apiAuthPrefix = "/api/auth";

export const LOGIN_REDIRECT = "/blog/feed/1";
