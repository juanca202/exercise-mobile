import { describe, expect, it } from "vitest";

import { formatCurrency } from "./format-currency";

describe("formatCurrency", () => {
  it("formats amounts in en-US with dollar symbol", () => {
    expect(formatCurrency(1250.5)).toBe("$1,250.50");
  });

  it("preserves negative sign for debits", () => {
    expect(formatCurrency(-42.75)).toBe("-$42.75");
  });
});
