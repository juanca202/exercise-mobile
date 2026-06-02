import {
  DEMO_UNAVAILABLE_PATH,
  HOME_PATH,
  LOGIN_PATH,
} from "@/shared/routes";

export type RouteAccess = "public" | "protected";

const ROUTE_ACCESS: Record<string, RouteAccess> = {
  [LOGIN_PATH]: "public",
  [HOME_PATH]: "protected",
  [DEMO_UNAVAILABLE_PATH]: "protected",
};

export function getRouteAccess(pathname: string): RouteAccess | undefined {
  return ROUTE_ACCESS[pathname];
}

export function isProtectedPath(pathname: string): boolean {
  return getRouteAccess(pathname) === "protected";
}

export function isPublicPath(pathname: string): boolean {
  return getRouteAccess(pathname) === "public";
}

export function shouldRedirectToLogin(
  pathname: string,
  hasSession: boolean,
): boolean {
  return isProtectedPath(pathname) && !hasSession;
}

export function shouldRedirectToHome(
  pathname: string,
  hasSession: boolean,
): boolean {
  return pathname === LOGIN_PATH && hasSession;
}

export function allowsAuthenticatedAccess(
  pathname: string,
  hasSession: boolean,
): boolean {
  return isProtectedPath(pathname) && hasSession;
}
