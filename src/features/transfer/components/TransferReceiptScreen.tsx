"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { TransferIcon } from "@/components/ui/TransferIcon";
import { formatCurrency } from "@/shared/lib/format-currency";
import { HOME_PATH, TRANSFER_PATH } from "@/shared/routes";

import { shareReceipt } from "../lib/share-receipt";
import { useTransferStore } from "../store/transfer-store";
import { ReceiptWatermark } from "./ReceiptWatermark";
import {
  BankBrandMark,
  DetailDividerRow,
  formatAccountNumberReviewMasked,
  formatMaskedAccountNumber,
  ShareIcon,
  SuccessBadge,
  TransferBackHeader,
  TransferPrimaryButton,
  TransferScreenShell,
  TransferTextButton,
} from "./transfer-ui";

export function TransferReceiptScreen() {
  const router = useRouter();
  const receipt = useTransferStore((state) => state.lastReceipt);
  const clearReceipt = useTransferStore((state) => state.clearReceipt);
  const accounts = useTransferStore((state) => state.accounts);
  const [shareError, setShareError] = useState<string | null>(null);

  if (!receipt) {
    return null;
  }

  const source = accounts.find(
    (account) => account.number === receipt.sourceAccountNumber,
  );
  const target = accounts.find(
    (account) => account.number === receipt.targetAccountNumber,
  );

  const executedLabel = new Date(receipt.executedAt).toLocaleString("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  async function handleShare(currentReceipt: NonNullable<typeof receipt>) {
    setShareError(null);
    try {
      await shareReceipt(currentReceipt);
    } catch (error) {
      setShareError(
        error instanceof Error ? error.message : "No se pudo compartir",
      );
    }
  }

  return (
    <TransferScreenShell gradientClassName="bg-surface-muted">
      <TransferBackHeader title="Comprobante" />

      <div className="relative overflow-hidden rounded-container-sm bg-white p-3 shadow-[0_8px_16px_rgba(0,0,0,0.02)]">
        <ReceiptWatermark />

        <div className="relative z-10">
          <div className="flex flex-col items-center gap-2 border-b border-[#e2e2e2] pb-4 text-center">
            <BankBrandMark />
            <SuccessBadge />
            <p className="text-caption leading-5 text-primary">
              ¡Transferencia exitosa!
            </p>
            <p className="text-[1.125rem] leading-7 text-ink">
              {formatCurrency(receipt.amount)}
            </p>
            <p className="text-[0.5rem] leading-5 text-[#3e494b]">
              Comprobante {receipt.receiptNumber}
            </p>
            <p className="text-caption leading-5 text-[#3e494b]">
              {executedLabel}
            </p>
          </div>

          <div className="mt-2 flex flex-col">
            <ReceiptAccountRow
              accountName={source?.name ?? "Cuenta"}
              iconName="wallet"
              label="Desde"
              masked={
                source
                  ? formatAccountNumberReviewMasked(source)
                  : formatMaskedAccountNumber(
                      receipt.sourceAccountNumber,
                      "saving",
                    )
              }
            />
            <ReceiptAccountRow
              accountName={target?.name ?? "Cuenta"}
              iconName="user-vneck"
              label="Hacia"
              masked={
                target
                  ? formatAccountNumberReviewMasked(target)
                  : formatMaskedAccountNumber(
                      receipt.targetAccountNumber,
                      "checking",
                    )
              }
            />
            <DetailDividerRow label="Concepto" value={receipt.description} />
            <DetailDividerRow
              label="Comisión"
              value={formatCurrency(receipt.commission)}
            />
          </div>
        </div>
      </div>

      {shareError ? (
        <p className="mt-4 text-body text-primary-deep" role="alert">
          {shareError}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-4">
        <TransferPrimaryButton
          onClick={() => void handleShare(receipt)}
          showArrow={false}
        >
          <ShareIcon />
          Compartir
        </TransferPrimaryButton>
        <TransferPrimaryButton
          onClick={() => {
            clearReceipt();
            router.push(TRANSFER_PATH);
          }}
          showArrow={false}
          variant="outline"
        >
          Nueva transferencia
        </TransferPrimaryButton>
        <TransferTextButton
          onClick={() => {
            clearReceipt();
            router.push(HOME_PATH);
          }}
        >
          Ir al inicio
        </TransferTextButton>
      </div>
    </TransferScreenShell>
  );
}

function ReceiptAccountRow({
  label,
  accountName,
  masked,
  iconName,
}: {
  label: string;
  accountName: string;
  masked: string;
  iconName: "wallet" | "user-vneck";
}) {
  return (
    <div className="flex items-center gap-4 border-b border-[#e2e2e2] px-3 py-4 last:border-b-0">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-input bg-primary-tint p-2">
        <TransferIcon name={iconName} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-caption leading-5 text-secondary">{label}</p>
        <p className="text-body leading-normal text-secondary">{accountName}</p>
        <p className="text-caption leading-5 text-tertiary">{masked}</p>
      </div>
    </div>
  );
}
