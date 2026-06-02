import type { Account, Movement } from "./types";

export const mockAccounts: Account[] = [
  {
    id: "acc-001",
    number: "001234567890",
    balance: 1250.5,
    type: "saving",
    name: "Cuenta principal",
  },
  {
    id: "acc-002",
    number: "009876543210",
    balance: 420,
    type: "checking",
    name: "Cuenta corriente",
  },
  {
    id: "acc-003",
    number: "4111111111111111",
    balance: 120.75,
    type: "credit-card",
    name: "Tarjeta clásica",
  },
];

export const mockMovements: Movement[] = [
  {
    accountNumber: "001234567890",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Transferencia recibida",
    amount: 250,
  },
  {
    accountNumber: "009876543210",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Pago de servicios",
    amount: -42.75,
  },
  {
    accountNumber: "4111111111111111",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Compra en comercio",
    amount: -89.9,
  },
  {
    accountNumber: "001234567890",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Depósito en efectivo",
    amount: 500,
  },
];
