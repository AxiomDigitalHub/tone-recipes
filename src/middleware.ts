import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* -------------------------------------------------------------------------- */
/*  Geo-blocking: OFAC-sanctioned + high-risk countries                       */
/*  Uses Vercel's x-vercel-ip-country header (ISO 3166-1 alpha-2)            */
/* -------------------------------------------------------------------------- */

const BLOCKED_COUNTRIES = new Set([
  // OFAC fully sanctioned
  "IR", // Iran
  "KP", // North Korea
  "SY", // Syria
  "CU", // Cuba

  // High-risk for bot/scraping/fraud traffic
  "CN", // China
  "RU", // Russia
  "BY", // Belarus
]);

export function middleware(request: NextRequest) {
  // ---- Geo-block ----
  const country = request.headers.get("x-vercel-ip-country") ?? "";
  if (country && BLOCKED_COUNTRIES.has(country)) {
    return new NextResponse("Access restricted in your region.", {
      status: 403,
    });
  }

  // ---- www → non-www redirect ----
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const newUrl = new URL(request.url);
    newUrl.host = host.replace(/^www\./, "");
    return NextResponse.redirect(newUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static files and API routes
  matcher: ["/((?!_next/static|_next/image|favicon\\.svg|api/).*)"],
};
