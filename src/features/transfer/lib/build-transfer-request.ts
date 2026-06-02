import type { Account } from "@/features/landing/lib/types";

import { formatDescriptionForDisplay } from "./validate-transfer-draft";
import type { TransferFormDraft, TransferRequest } from "./types";

export const DEMO_ROUTER_NUMBER = "021000021";

export function buildTransferRequest(
  draft: TransferFormDraft,
  accounts: Account[],
): TransferRequest {
  const source = accounts.find((account) => account.id === draft.sourceAccountId);
  const target = accounts.find((account) => account.id === draft.targetAccountId);

  if (!source || !target) {
    throw new Error("Cuentas de transferencia no encontradas");
  }

  return {
    sourceAccountNumber: source.number,
    targetAccountNumber: target.number,
    routerNumber: DEMO_ROUTER_NUMBER,
    amount: draft.amount,
    description: formatDescriptionForDisplay(draft.description),
  };
}
