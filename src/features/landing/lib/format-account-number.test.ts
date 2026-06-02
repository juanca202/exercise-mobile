import { describe, expect, it } from "vitest";

import { formatAccountNumber } from "./format-account-number";

describe("formatAccountNumber", () => {
  it("masks all but the last four digits", () => {
    expect(formatAccountNumber("001234567890")).toBe("****7890");
  });

  it("handles credit card numbers", () => {
    expect(formatAccountNumber("4111111111111111")).toBe("****1111");
  });

  it("returns mask prefix when no digits are present", () => {
    expect(formatAccountNumber("")).toBe("****");
  });
});
