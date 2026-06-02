import { afterEach, describe, expect, it, vi } from "vitest";

import { DEMO_ROUTER_NUMBER } from "./build-transfer-request";
import { executeTransfer, TransferExecutionError } from "./execute-transfer";

describe("executeTransfer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns receipt fields on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          message: "Transferencia realizada con éxito.",
          receiptNumber: "TRX-ABC",
          executedAt: "2026-06-01T10:00:00.000Z",
        }),
      }),
    );

    const result = await executeTransfer({
      sourceAccountNumber: "001",
      targetAccountNumber: "002",
      routerNumber: DEMO_ROUTER_NUMBER,
      amount: 25,
      description: "Prueba",
    });

    expect(result.receiptNumber).toBe("TRX-ABC");
    expect(result.executedAt).toBeTruthy();
  });

  it("throws on API error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Saldo insuficiente" }),
      }),
    );

    await expect(
      executeTransfer({
        sourceAccountNumber: "001",
        targetAccountNumber: "002",
        routerNumber: DEMO_ROUTER_NUMBER,
        amount: 25,
        description: "Prueba",
      }),
    ).rejects.toBeInstanceOf(TransferExecutionError);
  });
});
