import type { ProtectedRouteConfig } from "./types";

export const PROTECTED_ROUTES: ProtectedRouteConfig[] = [
  { path: "/", label: "Resumen" },
  { path: "/demo-unavailable", label: "Demo no disponible" },
  { path: "/transfer", label: "Transferencias" },
];

export function isProtectedPath(pathname: string): boolean {
  if (pathname.startsWith("/transfer")) {
    return true;
  }

  return PROTECTED_ROUTES.some((route) => route.path === pathname);
}
