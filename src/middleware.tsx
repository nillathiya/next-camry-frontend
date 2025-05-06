// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { pagesOptions } from "./app/api/auth/[...nextauth]/pages-options";

export default withAuth({
  pages: {
    ...pagesOptions,
  },
  callbacks: {
    authorized: ({ req, token }) => {
      // Protect dashboard routes
      if (req.nextUrl.pathname.startsWith("/dashboard")) {
        if (process.env.NODE_ENV === "development") {
          console.log("session token", token);
        }
        return !!token;
      }

      if (req.nextUrl.pathname.startsWith("/auth") && token) {
        return false;
      }

      return true;
    },
  },
});

// Middleware to handle redirects for authenticated users on auth routes
export async function middleware(req: NextRequest) {
  const token =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");
  if (process.env.NODE_ENV === "development") {
    console.log("session token in middleware", token);
  }

  if (req.nextUrl.pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Redirect authenticated users away from auth routes
  if (req.nextUrl.pathname.startsWith("/auth") && token) {
    return NextResponse.redirect(new URL("/dashboard/default", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
