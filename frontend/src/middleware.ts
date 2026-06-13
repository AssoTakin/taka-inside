import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BYPASS_COOKIE = "taka-preview";
const BYPASS_VALUE = "taka2026";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Ne pas intercepter les assets statiques, API, et la page coming-soon
  const isPublicPath =
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/coming-soon") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.png";

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Si accès via takainside.org (et pas sur un chemin public)
  if (hostname.includes("takainside.org")) {
    const bypass = request.cookies.get(BYPASS_COOKIE)?.value;

    if (bypass === BYPASS_VALUE) {
      return NextResponse.next();
    }

    // Rediriger vers coming-soon
    return NextResponse.rewrite(new URL("/coming-soon", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|icon.png|images|coming-soon).*)",
};
