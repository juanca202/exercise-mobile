import { describe, expect, it } from "vitest";

import { validateCredentials } from "./auth-service.mock";

describe("validateCredentials", () => {
  it("accepts non-empty username and password", () => {
    const result = validateCredentials({
      username: "a",
      password: "b",
    });

    expect(result).toEqual({
      ok: true,
      session: {
        isAuthenticated: true,
        username: "a",
      },
    });
  });

  it("rejects empty username", () => {
    const result = validateCredentials({
      username: "",
      password: "b",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("VALIDATION");
    }
  });

  it("rejects whitespace-only password", () => {
    const result = validateCredentials({
      username: "a",
      password: "   ",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("VALIDATION");
      expect(result.error.message).toMatch(/obligatorios/i);
    }
  });
});
