import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  AUTH_SESSION_COOKIE,
  hasValidSessionCookie,
} from "@/features/auth/lib/auth-session";
import { resolveAuthRedirect } from "@/features/auth/lib/auth-redirect";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rawCookie = request.cookies.get(AUTH_SESSION_COOKIE)?.value;
  const cookieValue = rawCookie ? decodeURIComponent(rawCookie) : undefined;
  const hasSession = hasValidSessionCookie(cookieValue);

  const resolution = resolveAuthRedirect(pathname, hasSession);
  if (resolution.kind === "redirect") {
    return NextResponse.redirect(new URL(resolution.destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/demo-unavailable", "/transfer", "/transfer/:path*"],
};
