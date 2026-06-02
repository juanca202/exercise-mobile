import { describe, expect, it } from "vitest";

import {
  emptyCredentials,
  invalidCredentials,
  validDemoCredentials,
} from "../testing/auth-object-mother";
import { authenticate } from "./mock-auth-service";

describe("authenticate", () => {
  it("returns VALIDATION_ERROR when username is empty", () => {
    expect(authenticate({ username: "  ", password: "secret" })).toEqual({
      success: false,
      error: "VALIDATION_ERROR",
    });
  });

  it("returns VALIDATION_ERROR when password is empty", () => {
    expect(authenticate(emptyCredentials())).toEqual({
      success: false,
      error: "VALIDATION_ERROR",
    });
  });

  it("returns session for valid demo credentials", () => {
    expect(authenticate(validDemoCredentials())).toEqual({
      success: true,
      session: { username: "demo.user" },
    });
  });

  it("returns INVALID_CREDENTIALS for unknown user", () => {
    expect(authenticate(invalidCredentials())).toEqual({
      success: false,
      error: "INVALID_CREDENTIALS",
    });
  });
});
