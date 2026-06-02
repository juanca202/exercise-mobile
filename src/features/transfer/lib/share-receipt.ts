import { formatAccountNumber } from "@/shared/lib/format-account-number";
import { formatCurrency } from "@/shared/lib/format-currency";

import type { TransferReceipt } from "./types";

export function formatReceiptShareText(receipt: TransferReceipt): string {
  const executed = new Date(receipt.executedAt).toLocaleString("es");

  return [
    "Comprobante de transferencia",
    `Monto: ${formatCurrency(receipt.amount)}`,
    `Número: ${receipt.receiptNumber}`,
    `Fecha: ${executed}`,
    `Desde: ${formatAccountNumber(receipt.sourceAccountNumber)}`,
    `Hacia: ${formatAccountNumber(receipt.targetAccountNumber)}`,
    `Concepto: ${receipt.description}`,
    `Comisión: ${formatCurrency(receipt.commission)}`,
  ].join("\n");
}

export async function shareReceipt(receipt: TransferReceipt): Promise<void> {
  const text = formatReceiptShareText(receipt);

  if (typeof navigator !== "undefined" && navigator.share) {
    await navigator.share({ title: "Comprobante de transferencia", text });
    return;
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  throw new Error("Compartir no está disponible en este dispositivo");
}
