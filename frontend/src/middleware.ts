import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BYPASS_COOKIE = "taka-preview";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Ne pas intercepter les assets statiques, API, et la page coming-soon
  const isPublicPath =
    pathname.startsWith("/api") ||
    pathname.startsWith("/coming-soon") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.png" ||
    pathname.startsWith("/images") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/_next");

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Si accès via takainside.org (et pas sur un chemin public)
  if (hostname.includes("takainside.org")) {
    const bypassValue = process.env.PREVIEW_SECRET || "";
    const cookieBypass = request.cookies.get(BYPASS_COOKIE)?.value;
    const queryBypass = request.nextUrl.searchParams.get("preview");

    if (bypassValue && (cookieBypass === bypassValue || queryBypass === bypassValue)) {
      const response = NextResponse.next();
      if (queryBypass === bypassValue) {
        response.cookies.set(BYPASS_COOKIE, bypassValue, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24, // 24h
        });
      }
      return response;
    }

    // Rediriger vers coming-soon
    return NextResponse.rewrite(new URL("/coming-soon", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|icon.png|images|coming-soon).*)",
};
