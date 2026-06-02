import { describe, expect, it } from "vitest";

import {
  DEMO_UNAVAILABLE_PATH,
  HOME_PATH,
  LOGIN_PATH,
} from "@/shared/routes";

import {
  allowsAuthenticatedAccess,
  isProtectedPath,
  isPublicPath,
  shouldRedirectToHome,
  shouldRedirectToLogin,
} from "./protected-routes";

describe("protected-routes", () => {
  it("classifies login as public and home as protected", () => {
    expect(isPublicPath(LOGIN_PATH)).toBe(true);
    expect(isProtectedPath(HOME_PATH)).toBe(true);
    expect(isProtectedPath(DEMO_UNAVAILABLE_PATH)).toBe(true);
  });

  it("requires redirect to login for unauthenticated demo-unavailable", () => {
    expect(shouldRedirectToLogin(DEMO_UNAVAILABLE_PATH, false)).toBe(true);
    expect(shouldRedirectToLogin(DEMO_UNAVAILABLE_PATH, true)).toBe(false);
  });

  it("requires redirect to login for unauthenticated protected routes", () => {
    expect(shouldRedirectToLogin(HOME_PATH, false)).toBe(true);
    expect(shouldRedirectToLogin(HOME_PATH, true)).toBe(false);
  });

  it("allows authenticated access to protected routes", () => {
    expect(allowsAuthenticatedAccess(HOME_PATH, true)).toBe(true);
    expect(allowsAuthenticatedAccess(HOME_PATH, false)).toBe(false);
  });

  it("redirects authenticated users away from login", () => {
    expect(shouldRedirectToHome(LOGIN_PATH, true)).toBe(true);
    expect(shouldRedirectToHome(LOGIN_PATH, false)).toBe(false);
  });
});
