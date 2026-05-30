import { HOME_PATH, LOGIN_PATH } from "@/shared/constants/routes";

import { isProtectedPath } from "./protected-routes";

export type RedirectResolution =
  | { kind: "none" }
  | { kind: "redirect"; destination: string };

export function resolveAuthRedirect(
  pathname: string,
  hasSession: boolean,
): RedirectResolution {
  if (pathname === LOGIN_PATH && hasSession) {
    return { kind: "redirect", destination: HOME_PATH };
  }

  if (isProtectedPath(pathname) && !hasSession) {
    return { kind: "redirect", destination: LOGIN_PATH };
  }

  return { kind: "none" };
}
