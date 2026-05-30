import { describe, expect, it } from "vitest";

import { isProtectedPath, PROTECTED_ROUTES } from "./protected-routes";

describe("protected-routes", () => {
  it("includes home path in catalog", () => {
    expect(PROTECTED_ROUTES).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: "/" })]),
    );
  });

  it("detects protected paths", () => {
    expect(isProtectedPath("/")).toBe(true);
    expect(isProtectedPath("/login")).toBe(false);
  });
});
