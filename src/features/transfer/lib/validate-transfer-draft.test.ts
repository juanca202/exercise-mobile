import { describe, expect, it } from "vitest";

import { eligibleAccountsMother, validDraftMother } from "../testing/transfer-object-mother";
import { validateTransferDraft } from "./validate-transfer-draft";

describe("validateTransferDraft", () => {
  it("accepts amount within inclusive range including decimals", () => {
    expect(
      validateTransferDraft(
        validDraftMother({ amount: 5 }),
        eligibleAccountsMother,
      ).valid,
    ).toBe(true);
    const highBalanceAccounts = eligibleAccountsMother.map((account) =>
      account.id === "acc-001" ? { ...account, balance: 5000 } : account,
    );
    expect(
      validateTransferDraft(
        validDraftMother({ amount: 2000 }),
        highBalanceAccounts,
      ).valid,
    ).toBe(true);
    expect(
      validateTransferDraft(
        validDraftMother({ amount: 10.5 }),
        eligibleAccountsMother,
      ).valid,
    ).toBe(true);
  });

  it("rejects amount below 5 or above 2000", () => {
    const below = validateTransferDraft(
      validDraftMother({ amount: 4.99 }),
      eligibleAccountsMother,
    );
    expect(below.valid).toBe(false);
    expect(below.message).toMatch(/\$5.*\$2000/i);

    const above = validateTransferDraft(
      validDraftMother({ amount: 2000.01 }),
      eligibleAccountsMother,
    );
    expect(above.valid).toBe(false);
  });

  it("rejects same source and target", () => {
    const result = validateTransferDraft(
      validDraftMother({
        sourceAccountId: "acc-001",
        targetAccountId: "acc-001",
      }),
      eligibleAccountsMother,
    );

    expect(result.valid).toBe(false);
    expect(result.code).toBe("same_account");
  });

  it("rejects amount greater than source balance", () => {
    const result = validateTransferDraft(
      validDraftMother({ amount: 2000 }),
      eligibleAccountsMother,
    );

    expect(result.valid).toBe(false);
    expect(result.code).toBe("insufficient_balance");
  });
});
