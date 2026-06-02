"use client";

import { TRANSFER_OWN_PATH } from "@/shared/routes";

import { isDraftValidForReview } from "../lib/review-route-guard";
import { useTransferStore } from "../store/transfer-store";
import { TransferRouteGuard } from "./TransferRouteGuard";
import { TransferReviewScreen } from "./TransferReviewScreen";

export function TransferReviewGuard() {
  const draft = useTransferStore((state) => state.draft);
  const accounts = useTransferStore((state) => state.accounts);

  return (
    <TransferRouteGuard
      allowed={isDraftValidForReview(draft, accounts)}
      redirectTo={TRANSFER_OWN_PATH}
    >
      <TransferReviewScreen />
    </TransferRouteGuard>
  );
}
