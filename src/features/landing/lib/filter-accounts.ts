import type { Account, AccountFilter } from "./types";

export function filterAccountsByChip(
  accounts: Account[],
  filter: AccountFilter,
): Account[] {
  switch (filter) {
    case "accounts":
      return accounts.filter(
        (account) => account.type === "saving" || account.type === "checking",
      );
    case "cards":
      return accounts.filter((account) => account.type === "credit-card");
    case "investments":
      return [];
    case "all":
    default:
      return accounts;
  }
}
