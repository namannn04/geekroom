import { NextResponse, type NextRequest } from "next/server";

/**
 * Geek Room Track lives at track.geekroom.co.in (or track.localhost:3000 in dev).
 * Requests on that host are rewritten into the /track route tree; the main site
 * never serves /track directly, it sends people to the subdomain.
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname, search } = req.nextUrl;
  const isTrackPath = pathname === "/track" || pathname.startsWith("/track/");

  if (host.startsWith("track.")) {
    if (isTrackPath) {
      const url = req.nextUrl.clone();
      url.pathname = pathname.slice("/track".length) || "/";
      return NextResponse.redirect(url);
    }
    const url = req.nextUrl.clone();
    url.pathname = `/track${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  if (isTrackPath) {
    const bare = host.replace(/^www\./, "");
    const proto = req.nextUrl.protocol;
    return NextResponse.redirect(`${proto}//track.${bare}${pathname.slice("/track".length) || "/"}${search}`);
  }
  return NextResponse.next();
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (images, icons, PDFs)
  matcher: ["/((?!_next/|api/|.*\\.[\\w]+$).*)"],
};
