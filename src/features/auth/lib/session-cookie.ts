export const SESSION_COOKIE_NAME = "demo-auth-session";

export function setSessionCookie(): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${SESSION_COOKIE_NAME}=1; path=/; SameSite=Lax`;
}

export function clearSessionCookie(): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export function hasSessionCookieFromHeader(
  cookieHeader: string | null | undefined,
): boolean {
  if (!cookieHeader) {
    return false;
  }

  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .some(
      (part) =>
        part.startsWith(`${SESSION_COOKIE_NAME}=`) &&
        part.length > `${SESSION_COOKIE_NAME}=`.length,
    );
}
