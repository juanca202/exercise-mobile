import type { Account, Movement } from "../lib/types";

export function demoAccounts(): Account[] {
  return [
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
    },
    {
      id: "acc-003",
      number: "4111111111111111",
      balance: 120.75,
      type: "credit-card",
      name: "Tarjeta clásica",
    },
  ];
}

export function demoMovements(): Movement[] {
  return [
    {
      accountNumber: "001234567890",
      date: "2026-05-30T10:00:00.000Z",
      description: "Transferencia recibida",
      amount: 250,
    },
    {
      accountNumber: "009876543210",
      date: "2026-05-28T14:30:00.000Z",
      description: "Pago de servicios",
      amount: -42.75,
    },
    {
      accountNumber: "4111111111111111",
      date: "2026-05-26T09:15:00.000Z",
      description: "Compra en comercio",
      amount: -89.9,
    },
  ];
}

export function singleAccount(): Account[] {
  return [demoAccounts()[0]];
}

export function emptyMovements(): Movement[] {
  return [];
}
