import { describe, expect, it } from "vitest";

import { formatMovementDateParts } from "./format-movement-date";

describe("formatMovementDateParts", () => {
  it("returns day and Spanish month abbreviation", () => {
    expect(formatMovementDateParts("2026-04-20T10:00:00.000Z")).toEqual({
      day: "20",
      month: "ABR",
    });
  });
});
