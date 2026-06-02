import { describe, expect, it } from "vitest";

import { eligibleAccountsMother, validDraftMother } from "../testing/transfer-object-mother";
import { isDraftValidForReview } from "./review-route-guard";

describe("review-route-guard", () => {
  it("allows review when draft is valid", () => {
    expect(
      isDraftValidForReview(validDraftMother(), eligibleAccountsMother),
    ).toBe(true);
  });

  it("blocks review when draft is missing or invalid", () => {
    expect(isDraftValidForReview(null, eligibleAccountsMother)).toBe(false);
    expect(
      isDraftValidForReview(
        validDraftMother({ amount: 1 }),
        eligibleAccountsMother,
      ),
    ).toBe(false);
  });
});
