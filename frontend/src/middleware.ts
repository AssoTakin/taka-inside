import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BYPASS_COOKIE = "taka-preview";
const BYPASS_VALUE = "taka2026";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Ne pas intercepter les assets statiques, API, la page coming-soon, et le formulaire bénévole
  const isPublicPath =
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/coming-soon") ||
    pathname.startsWith("/devenir-benevole") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.png";

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Si accès via takainside.org (et pas sur un chemin public)
  if (hostname.includes("takainside.org")) {
    // Autoriser aussi le paramètre ?preview=taka2026 (pas seulement le cookie)
    const previewParam = request.nextUrl.searchParams.get("preview");
    if (previewParam === BYPASS_VALUE) {
      const response = NextResponse.next();
      response.cookies.set(BYPASS_COOKIE, BYPASS_VALUE, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      });
      return response;
    }

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
  // Next.js 16 a déplacé les middlewares vers le runtime 'proxy' par défaut,
  // mais la convention `middleware.ts` reste supportée via matcher + runtime.
  runtime: 'nodejs',
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|icon.png|images|coming-soon|devenir-benevole).*)",
};
