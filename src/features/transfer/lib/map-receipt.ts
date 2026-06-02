import type { Account } from "@/features/landing/lib/types";

import { formatDescriptionForDisplay } from "./validate-transfer-draft";
import type {
  TransferApiResponse,
  TransferFormDraft,
  TransferReceipt,
} from "./types";

export function mapTransferResponseToReceipt(
  draft: TransferFormDraft,
  accounts: Account[],
  response: TransferApiResponse,
): TransferReceipt {
  const source = accounts.find((account) => account.id === draft.sourceAccountId);
  const target = accounts.find((account) => account.id === draft.targetAccountId);

  if (!source || !target) {
    throw new Error("Cuentas de transferencia no encontradas");
  }

  return {
    receiptNumber: response.receiptNumber,
    executedAt: response.executedAt,
    amount: draft.amount,
    sourceAccountNumber: source.number,
    targetAccountNumber: target.number,
    description: formatDescriptionForDisplay(draft.description),
    commission: 0,
    message: response.message,
  };
}
