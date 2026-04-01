import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Redirect www.faderandknob.com → faderandknob.com (301)
 * Fixes duplicate content issue flagged by SEMrush — 48 pages
 * were being indexed under both hostnames.
 */
export function middleware(request: NextRequest) {
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
