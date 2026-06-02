import { mockAccounts } from "@/features/landing/lib/mock-data";
import type { Account } from "@/features/landing/lib/types";

let demoAccounts: Account[] = mockAccounts.map((account) => ({ ...account }));

export function getDemoAccounts(): Account[] {
  return demoAccounts.map((account) => ({ ...account }));
}

export function findDemoAccountByNumber(number: string): Account | undefined {
  return demoAccounts.find((account) => account.number === number);
}

export function applyTransferBetweenAccounts(
  sourceNumber: string,
  targetNumber: string,
  amount: number,
): void {
  demoAccounts = demoAccounts.map((account) => {
    if (account.number === sourceNumber) {
      return { ...account, balance: account.balance - amount };
    }
    if (account.number === targetNumber) {
      return { ...account, balance: account.balance + amount };
    }
    return account;
  });
}

export function resetDemoAccounts(): void {
  demoAccounts = mockAccounts.map((account) => ({ ...account }));
}
