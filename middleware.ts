import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  protectedRoutes,
  LOGIN_REDIRECT,
} from "./routes";
const { auth: middleware } = NextAuth(authConfig);
function matchRoute(routeList: (string | RegExp)[], pathname: string): boolean {
  return routeList.some((route) =>
    typeof route === "string" ? pathname === route : route.test(pathname)
  );
}
export default middleware(async (req) => {
  const { nextUrl, auth } = req;
  const pathname = nextUrl.pathname;
  const isLoggedIn = !!auth;
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = matchRoute(authRoutes, pathname);
  const isPublicRoute = matchRoute(publicRoutes, pathname);
  const isProtectedRoute = matchRoute(protectedRoutes, pathname);
  const isAdminRoute = pathname.startsWith("/admin");
  const redirectToLogin = () => {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  };
  if (isApiAuthRoute) return;
  if (isAuthRoute && !isLoggedIn) {
    return;
  }
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL(LOGIN_REDIRECT, nextUrl));
  }
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return redirectToLogin();
    }
    if (auth?.user?.role !== "ADMIN") {
      return Response.redirect(new URL("/forbidden", nextUrl));
    }
  }
  if (isProtectedRoute && !isLoggedIn) {
    return redirectToLogin();
  }
  if (!isLoggedIn && !isPublicRoute) {
    return redirectToLogin();
  }

  return;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
