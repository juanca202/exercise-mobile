import type { Account } from "@/features/landing/lib/types";

import type { TransferFormDraft, TransferReceipt } from "../lib/types";

export const eligibleAccountsMother: Account[] = [
  {
    id: "acc-001",
    number: "001234567890",
    balance: 1250.5,
    type: "saving",
    name: "Gastos",
  },
  {
    id: "acc-002",
    number: "009876543210",
    balance: 420,
    type: "checking",
    name: "Departamento",
  },
  {
    id: "acc-zero",
    number: "000000000646",
    balance: 0,
    type: "checking",
    name: "Cuenta corriente",
  },
];

export function validDraftMother(
  overrides: Partial<TransferFormDraft> = {},
): TransferFormDraft {
  return {
    sourceAccountId: "acc-001",
    targetAccountId: "acc-002",
    amount: 50,
    description: "",
    ...overrides,
  };
}

export function receiptMother(
  overrides: Partial<TransferReceipt> = {},
): TransferReceipt {
  return {
    receiptNumber: "TRX-20260601-001",
    executedAt: "2026-06-01T12:00:00.000Z",
    amount: 50,
    sourceAccountNumber: "001234567890",
    targetAccountNumber: "009876543210",
    description: "Sin concepto",
    commission: 0,
    message: "Transferencia realizada con éxito.",
    ...overrides,
  };
}
