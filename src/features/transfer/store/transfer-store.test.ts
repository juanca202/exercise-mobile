import { afterEach, describe, expect, it, vi } from "vitest";

import { eligibleAccountsMother, validDraftMother } from "../testing/transfer-object-mother";
import { useTransferStore } from "./transfer-store";

describe("transfer-store", () => {
  afterEach(() => {
    useTransferStore.setState({
      draft: null,
      lastReceipt: null,
      submitStatus: "idle",
      submitError: null,
      accounts: [],
      accountsStatus: "idle",
    });
    vi.restoreAllMocks();
  });

  it("swaps source and target accounts", () => {
    useTransferStore.getState().setDraft(validDraftMother());

    useTransferStore.getState().swapAccounts();

    expect(useTransferStore.getState().draft).toEqual(
      validDraftMother({
        sourceAccountId: "acc-002",
        targetAccountId: "acc-001",
      }),
    );
  });

  it("resets draft and clears receipt", () => {
    useTransferStore.getState().setDraft(validDraftMother());
    useTransferStore.setState({
      lastReceipt: {
        receiptNumber: "TRX-1",
        executedAt: "2026-06-01T00:00:00.000Z",
        amount: 10,
        sourceAccountNumber: "1",
        targetAccountNumber: "2",
        description: "Sin concepto",
        commission: 0,
      },
    });

    useTransferStore.getState().resetDraft();
    useTransferStore.getState().clearReceipt();

    expect(useTransferStore.getState().draft).toBeNull();
    expect(useTransferStore.getState().lastReceipt).toBeNull();
  });

  it("executes transfer and stores receipt", async () => {
    useTransferStore.setState({ accounts: eligibleAccountsMother });
    useTransferStore.getState().setDraft(validDraftMother());

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          message: "ok",
          receiptNumber: "TRX-99",
          executedAt: "2026-06-01T12:00:00.000Z",
        }),
      }),
    );

    const receipt = await useTransferStore.getState().executeTransferFromDraft();

    expect(receipt.receiptNumber).toBe("TRX-99");
    expect(useTransferStore.getState().lastReceipt?.receiptNumber).toBe("TRX-99");
  });
});
