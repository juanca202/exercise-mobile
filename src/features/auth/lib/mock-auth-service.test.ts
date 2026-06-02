import { describe, expect, it } from "vitest";

import {
  emptyCredentials,
  invalidCredentials,
  validDemoCredentials,
} from "../testing/auth-object-mother";
import { authenticate } from "./mock-auth-service";

describe("authenticate", () => {
  it("returns validation error when username is empty", () => {
    expect(authenticate({ username: "  ", password: "secret" }).ok).toBe(false);
  });

  it("returns validation error when password is empty", () => {
    expect(authenticate(emptyCredentials()).ok).toBe(false);
  });

  it("returns session for valid demo credentials", () => {
    const result = authenticate(validDemoCredentials());

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.session.username).toBe("demo.user");
    }
  });

  it("returns error for unknown user", () => {
    expect(authenticate(invalidCredentials()).ok).toBe(false);
  });
});
