import type { Account } from "@/features/landing/lib/types";

export type { Account };

export interface TransferFormDraft {
  sourceAccountId: string;
  targetAccountId: string;
  amount: number;
  description: string;
}

export interface TransferRequest {
  sourceAccountNumber: string;
  targetAccountNumber: string;
  routerNumber: string;
  amount: number;
  description: string;
}

export interface TransferApiResponse {
  message: string;
  receiptNumber: string;
  executedAt: string;
}

export interface TransferReceipt {
  receiptNumber: string;
  executedAt: string;
  amount: number;
  sourceAccountNumber: string;
  targetAccountNumber: string;
  description: string;
  commission: number;
  message?: string;
}

export type TransferValidationCode =
  | "amount_range"
  | "same_account"
  | "insufficient_balance"
  | "missing_accounts"
  | "invalid_amount";

export interface TransferValidationResult {
  valid: boolean;
  code?: TransferValidationCode;
  message?: string;
}

export type TransferSubmitStatus = "idle" | "loading" | "error";
