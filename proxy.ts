import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  AUTH_SESSION_COOKIE,
  hasValidSessionCookie,
} from "@/features/auth/lib/auth-session";
import {
  shouldRedirectToHome,
  shouldRedirectToLogin,
} from "@/features/auth/lib/protected-routes";
import { HOME_PATH, LOGIN_PATH } from "@/shared/routes";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rawCookie = request.cookies.get(AUTH_SESSION_COOKIE)?.value;
  const cookieValue = rawCookie ? decodeURIComponent(rawCookie) : undefined;
  const hasSession = hasValidSessionCookie(cookieValue);

  if (shouldRedirectToLogin(pathname, hasSession)) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  if (shouldRedirectToHome(pathname, hasSession)) {
    return NextResponse.redirect(new URL(HOME_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/demo-unavailable"],
};
