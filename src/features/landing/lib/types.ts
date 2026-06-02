export type AccountType = "saving" | "checking" | "credit-card";

export interface Account {
  id: string;
  number: string;
  balance: number;
  type: AccountType;
  name?: string;
}

export interface Movement {
  accountNumber: string;
  date: string;
  description: string;
  amount: number;
}

export type SectionStatus = "idle" | "loading" | "success" | "error";

export type AccountFilter = "all" | "accounts" | "cards" | "investments";
