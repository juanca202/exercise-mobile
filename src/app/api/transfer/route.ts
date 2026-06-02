import { NextResponse } from "next/server";

import {
  applyTransferBetweenAccounts,
  findDemoAccountByNumber,
  getDemoAccounts,
} from "@/shared/demo/accounts-state";

import type { TransferRequest } from "@/features/transfer/lib/types";

const MIN_AMOUNT = 5;
const MAX_AMOUNT = 2000;

function validateTransferBody(body: TransferRequest): string | null {
  if (
    !body.sourceAccountNumber ||
    !body.targetAccountNumber ||
    !body.routerNumber
  ) {
    return "Datos de transferencia incompletos";
  }

  if (body.sourceAccountNumber === body.targetAccountNumber) {
    return "Origen y destino deben ser distintos";
  }

  if (typeof body.amount !== "number" || body.amount <= 0) {
    return "Monto inválido";
  }

  if (body.amount < MIN_AMOUNT || body.amount > MAX_AMOUNT) {
    return "El monto debe estar entre $5 y $2000";
  }

  const source = findDemoAccountByNumber(body.sourceAccountNumber);
  if (!source) {
    return "Cuenta origen no encontrada";
  }

  if (body.amount > source.balance) {
    return "Saldo insuficiente";
  }

  const target = findDemoAccountByNumber(body.targetAccountNumber);
  if (!target) {
    return "Cuenta destino no encontrada";
  }

  return null;
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("fail") === "1") {
    return NextResponse.json(
      { error: "Error simulado al procesar la transferencia" },
      { status: 500 },
    );
  }

  let body: TransferRequest;

  try {
    body = (await request.json()) as TransferRequest;
  } catch {
    return NextResponse.json({ error: "Cuerpo de petición inválido" }, { status: 400 });
  }

  const validationError = validateTransferBody(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  applyTransferBetweenAccounts(
    body.sourceAccountNumber,
    body.targetAccountNumber,
    body.amount,
  );

  void getDemoAccounts();

  const receiptNumber = `TRX-${Date.now().toString(36).toUpperCase()}`;

  return NextResponse.json({
    message: "Transferencia realizada con éxito.",
    receiptNumber,
    executedAt: new Date().toISOString(),
  });
}
