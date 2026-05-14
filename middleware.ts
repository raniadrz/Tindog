import { NextRequest, NextResponse } from "next/server";

const PUBLIC = ["/login", "/register", "/api/session"];
const AUTH_ONLY = ["/discover", "/matches", "/profile", "/chat", "/pricing", "/setup"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("__session")?.value;

  const isPublic = PUBLIC.some((p) => pathname.startsWith(p));
  const isProtected = AUTH_ONLY.some((p) => pathname.startsWith(p));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/" ) {
    if (session) return NextResponse.redirect(new URL("/discover", req.url));
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|public).*)"],
};
