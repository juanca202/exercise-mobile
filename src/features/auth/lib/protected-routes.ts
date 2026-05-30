import type { ProtectedRouteConfig } from "./types";

export const PROTECTED_ROUTES: ProtectedRouteConfig[] = [
  { path: "/", label: "Resumen" },
];

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => route.path === pathname);
}
