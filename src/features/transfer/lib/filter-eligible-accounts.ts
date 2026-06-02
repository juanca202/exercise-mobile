import type { Account } from "@/features/landing/lib/types";

export function filterEligibleTransferAccounts(accounts: Account[]): Account[] {
  return accounts.filter(
    (account) => account.type === "saving" || account.type === "checking",
  );
}

export function isAccountSelectableForTransfer(account: Account): boolean {
  return (
    (account.type === "saving" || account.type === "checking") &&
    account.balance > 0
  );
}

export function accountTypeLabel(type: Account["type"]): string {
  if (type === "saving") {
    return "Cta. Ahorros";
  }
  if (type === "checking") {
    return "Cta. corriente";
  }
  return "Cuenta";
}
