import { beforeEach, describe, expect, it, vi } from "vitest";

import * as authSession from "../lib/auth-session";
import { validDemoCredentials } from "../testing/auth-object-mother";
import { useAuthStore } from "./auth-store";

vi.mock("../lib/auth-session", () => ({
  setSessionCookie: vi.fn(),
  clearSessionCookie: vi.fn(),
  readSessionCookie: vi.fn(),
}));

describe("auth-store", () => {
  beforeEach(() => {
    useAuthStore.setState({
      username: "",
      isAuthenticated: false,
      isHydrated: false,
    });
    vi.clearAllMocks();
  });

  it("logs in with valid credentials and persists cookie", () => {
    const result = useAuthStore.getState().login(validDemoCredentials());

    expect(result.ok).toBe(true);
    expect(authSession.setSessionCookie).toHaveBeenCalledWith("demo.user");
    expect(useAuthStore.getState()).toMatchObject({
      username: "demo.user",
      isAuthenticated: true,
    });
  });

  it("does not authenticate with invalid credentials", () => {
    const result = useAuthStore.getState().login({
      username: "wrong",
      password: "wrong",
    });

    expect(result.ok).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(authSession.setSessionCookie).not.toHaveBeenCalled();
  });

  it("clears session on logout", () => {
    useAuthStore.setState({
      username: "demo.user",
      isAuthenticated: true,
    });

    useAuthStore.getState().logout();

    expect(authSession.clearSessionCookie).toHaveBeenCalled();
    expect(useAuthStore.getState()).toMatchObject({
      username: "",
      isAuthenticated: false,
    });
  });

  it("hydrates authenticated state from cookie", () => {
    vi.mocked(authSession.readSessionCookie).mockReturnValue({
      username: "demo.user",
    });

    useAuthStore.getState().hydrate();

    expect(useAuthStore.getState()).toMatchObject({
      username: "demo.user",
      isAuthenticated: true,
      isHydrated: true,
    });
  });

  it("hydrates unauthenticated state when cookie is missing", () => {
    vi.mocked(authSession.readSessionCookie).mockReturnValue(null);

    useAuthStore.getState().hydrate();

    expect(useAuthStore.getState()).toMatchObject({
      username: "",
      isAuthenticated: false,
      isHydrated: true,
    });
  });
});
