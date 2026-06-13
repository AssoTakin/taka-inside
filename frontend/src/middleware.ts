import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BYPASS_COOKIE = "taka-preview";
const BYPASS_VALUE = "taka2026"; // Mot de passe secret pour l'équipe

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Ne pas intercepter les assets statiques, API, et la page coming-soon elle-même
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/coming-soon") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.png"
  ) {
    return NextResponse.next();
  }

  // Si accès via takainside.org
  if (hostname.includes("takainside.org")) {
    const bypass = request.cookies.get(BYPASS_COOKIE)?.value;
    
    // Vérifier si le bypass est actif
    if (bypass === BYPASS_VALUE) {
      return NextResponse.next(); // Accès normal
    }

    // Sinon, rediriger vers la page coming-soon
    return NextResponse.rewrite(new URL("/coming-soon", request.url));
  }

  // Accès via vercel.app ou autre → normal
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.png|images|coming-soon).*)"],
};
