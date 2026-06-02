import type { Account } from "./types";

export async function fetchAccounts(): Promise<Account[]> {
  const response = await fetch("/api/accounts");

  if (!response.ok) {
    throw new Error("No se pudieron cargar las cuentas");
  }

  return response.json() as Promise<Account[]>;
}
