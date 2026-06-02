import { describe, expect, it } from "vitest";

import { formatRelativeDate } from "./format-relative-date";

describe("formatRelativeDate", () => {
  const now = new Date("2026-06-01T12:00:00.000Z");

  it('returns "hoy" for the same calendar day', () => {
    expect(formatRelativeDate("2026-06-01T08:00:00.000Z", now)).toBe("hoy");
  });

  it('returns "ayer" for the previous calendar day', () => {
    expect(formatRelativeDate("2026-05-31T20:00:00.000Z", now)).toBe("ayer");
  });

  it("returns Spanish relative phrase for older dates", () => {
    expect(formatRelativeDate("2026-05-28T10:00:00.000Z", now)).toBe(
      "hace 4 días",
    );
  });
});
