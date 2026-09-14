import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BYPASS_COOKIE = "taka-preview";
const BYPASS_VALUE = "taka2026";

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const bypassParam = searchParams.get("preview") === BYPASS_VALUE;
  const bypassCookie = request.cookies.get(BYPASS_COOKIE)?.value === BYPASS_VALUE;

  if (bypassParam) {
    const response = NextResponse.next();
    response.cookies.set(BYPASS_COOKIE, BYPASS_VALUE, {
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });
    return response;
  }

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/static/") ||
    pathname.match(/\.(?:ico|png|jpg|jpeg|svg|webp|css|js|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/coming-soon") {
    return NextResponse.next();
  }

  if (!bypassCookie) {
    return NextResponse.redirect(new URL("/coming-soon", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|.*\\.).*)"],
};
