import { beforeEach, describe, expect, it } from "vitest";

import { useAuthStore } from "./auth-store";
import { SESSION_COOKIE_NAME } from "./session-cookie";

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`;
    useAuthStore.setState({
      isAuthenticated: false,
      username: null,
    });
  });

  it("logs in with valid credentials and sets session cookie", () => {
    const result = useAuthStore.getState().login({
      username: "demo.user",
      password: "secret",
    });

    expect(result.ok).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().username).toBe("demo.user");
    expect(document.cookie).toContain(`${SESSION_COOKIE_NAME}=1`);
  });

  it("rejects invalid credentials without changing session", () => {
    const result = useAuthStore.getState().login({
      username: "",
      password: "secret",
    });

    expect(result.ok).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(document.cookie).not.toContain(`${SESSION_COOKIE_NAME}=1`);
  });

  it("clears session and cookie on logout", () => {
    useAuthStore.getState().login({
      username: "demo.user",
      password: "secret",
    });

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().username).toBeNull();
    expect(document.cookie).not.toContain(`${SESSION_COOKIE_NAME}=1`);
  });
});
