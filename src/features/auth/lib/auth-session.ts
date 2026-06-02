export const AUTH_SESSION_COOKIE = "auth-demo-session";

export function serializeSession(username: string): string {
  return JSON.stringify({ username });
}

export function parseSessionCookie(
  value: string | undefined | null,
): { username: string } | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as { username?: string };

    if (typeof parsed.username === "string" && parsed.username.length > 0) {
      return { username: parsed.username };
    }

    return null;
  } catch {
    return null;
  }
}

export function hasValidSessionCookie(
  value: string | undefined | null,
): boolean {
  return parseSessionCookie(value) !== null;
}

export function setSessionCookie(username: string): void {
  const value = encodeURIComponent(serializeSession(username));
  document.cookie = `${AUTH_SESSION_COOKIE}=${value}; path=/; SameSite=Lax`;
}

export function clearSessionCookie(): void {
  document.cookie = `${AUTH_SESSION_COOKIE}=; path=/; max-age=0`;
}

export function readSessionCookie(): { username: string } | null {
  if (typeof document === "undefined") {
    return null;
  }

  const prefix = `${AUTH_SESSION_COOKIE}=`;
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(prefix));

  if (!match) {
    return null;
  }

  const rawValue = match.slice(prefix.length);
  const decoded = decodeURIComponent(rawValue);

  return parseSessionCookie(decoded);
}
