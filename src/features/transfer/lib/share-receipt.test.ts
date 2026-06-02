import { afterEach, describe, expect, it, vi } from "vitest";

import { receiptMother } from "../testing/transfer-object-mother";
import { formatReceiptShareText, shareReceipt } from "./share-receipt";

describe("shareReceipt", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("formats share text with receipt details", () => {
    const text = formatReceiptShareText(receiptMother());

    expect(text).toContain("Comprobante de transferencia");
    expect(text).toContain("TRX-20260601-001");
    expect(text).toContain("Sin concepto");
  });

  it("uses navigator.share when available", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { share });

    await shareReceipt(receiptMother());

    expect(share).toHaveBeenCalled();
  });
});
