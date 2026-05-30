import { describe, expect, it } from "vitest";

import { resolveAuthRedirect } from "./auth-redirect";

describe("resolveAuthRedirect", () => {
  it("redirects anonymous users from protected home to login", () => {
    expect(resolveAuthRedirect("/", false)).toEqual({
      kind: "redirect",
      destination: "/login",
    });
  });

  it("allows authenticated users on protected home", () => {
    expect(resolveAuthRedirect("/", true)).toEqual({ kind: "none" });
  });

  it("redirects authenticated users away from login", () => {
    expect(resolveAuthRedirect("/login", true)).toEqual({
      kind: "redirect",
      destination: "/",
    });
  });

  it("allows anonymous users on login", () => {
    expect(resolveAuthRedirect("/login", false)).toEqual({ kind: "none" });
  });
});
