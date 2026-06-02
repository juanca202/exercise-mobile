"use client";

import { TRANSFER_PATH } from "@/shared/routes";

import { hasTransferReceipt } from "../lib/receipt-route-guard";
import { useTransferStore } from "../store/transfer-store";
import { TransferReceiptScreen } from "./TransferReceiptScreen";
import { TransferRouteGuard } from "./TransferRouteGuard";

export function TransferReceiptGuard() {
  const receipt = useTransferStore((state) => state.lastReceipt);

  return (
    <TransferRouteGuard
      allowed={hasTransferReceipt(receipt)}
      redirectTo={TRANSFER_PATH}
    >
      <TransferReceiptScreen />
    </TransferRouteGuard>
  );
}
