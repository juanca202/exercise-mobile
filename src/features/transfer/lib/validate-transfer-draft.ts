import type { Account } from "@/features/landing/lib/types";

import type { TransferFormDraft, TransferValidationResult } from "./types";

const MIN_AMOUNT = 5;
const MAX_AMOUNT = 2000;

export function validateTransferDraft(
  draft: TransferFormDraft,
  accounts: Account[],
): TransferValidationResult {
  const source = accounts.find((account) => account.id === draft.sourceAccountId);
  const target = accounts.find((account) => account.id === draft.targetAccountId);

  if (!source || !target) {
    return {
      valid: false,
      code: "missing_accounts",
      message: "Selecciona cuenta origen y destino.",
    };
  }

  if (Number.isNaN(draft.amount) || draft.amount <= 0) {
    return {
      valid: false,
      code: "invalid_amount",
      message: "Ingresa un monto válido.",
    };
  }

  if (draft.amount < MIN_AMOUNT || draft.amount > MAX_AMOUNT) {
    return {
      valid: false,
      code: "amount_range",
      message: "El monto debe estar entre $5 y $2000",
    };
  }

  if (draft.sourceAccountId === draft.targetAccountId) {
    return {
      valid: false,
      code: "same_account",
      message: "Origen y destino deben ser distintos",
    };
  }

  if (draft.amount > source.balance) {
    return {
      valid: false,
      code: "insufficient_balance",
      message: "Saldo insuficiente",
    };
  }

  return { valid: true };
}

export function formatDescriptionForDisplay(description: string): string {
  const trimmed = description.trim();
  return trimmed.length > 0 ? trimmed : "Sin concepto";
}
