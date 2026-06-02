import type { TransferReceipt } from "./types";

export function hasTransferReceipt(receipt: TransferReceipt | null): boolean {
  return receipt !== null;
}
