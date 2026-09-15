import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 usa "proxy.ts" ao invés de "middleware.ts"
export async function proxy(req: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session;
  const pathname = req.nextUrl.pathname;

  const isLoginPage = pathname.startsWith("/login");
  const isApiAuth = pathname.startsWith("/api/auth");
  const isStatic = pathname.startsWith("/_next") || pathname === "/favicon.ico";

  if (isStatic || isApiAuth) return NextResponse.next();
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
