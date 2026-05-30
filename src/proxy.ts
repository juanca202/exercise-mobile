import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { resolveAuthRedirect } from "@/features/auth/lib/auth-redirect";
import { SESSION_COOKIE_NAME } from "@/features/auth/lib/session-cookie";

export function proxy(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  const resolution = resolveAuthRedirect(request.nextUrl.pathname, hasSession);

  if (resolution.kind === "redirect") {
    return NextResponse.redirect(new URL(resolution.destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login"],
};
