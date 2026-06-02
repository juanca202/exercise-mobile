"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { formatCurrency } from "@/shared/lib/format-currency";
import {
  TRANSFER_OWN_PATH,
  TRANSFER_RECEIPT_PATH,
} from "@/shared/routes";

import { formatDescriptionForDisplay } from "../lib/validate-transfer-draft";
import { useTransferStore } from "../store/transfer-store";
import {
  DetailDividerRow,
  formatAccountNumberReviewMasked,
  TransferBackHeader,
  TransferPrimaryButton,
  TransferScreenShell,
  TransferTextButton,
} from "./transfer-ui";
import { TransferIcon } from "@/components/ui/TransferIcon";

export function TransferReviewScreen() {
  const router = useRouter();
  const draft = useTransferStore((state) => state.draft);
  const accounts = useTransferStore((state) => state.accounts);
  const submitStatus = useTransferStore((state) => state.submitStatus);
  const submitError = useTransferStore((state) => state.submitError);
  const resetDraft = useTransferStore((state) => state.resetDraft);
  const executeTransferFromDraft = useTransferStore(
    (state) => state.executeTransferFromDraft,
  );

  const [localError, setLocalError] = useState<string | null>(null);

  const source = accounts.find((account) => account.id === draft?.sourceAccountId);
  const target = accounts.find((account) => account.id === draft?.targetAccountId);

  if (!draft || !source || !target) {
    return null;
  }

  async function handleTransfer() {
    setLocalError(null);
    try {
      await executeTransferFromDraft();
      router.push(TRANSFER_RECEIPT_PATH);
    } catch (error) {
      setLocalError(
        error instanceof Error
          ? error.message
          : "No se pudo completar la transferencia",
      );
    }
  }

  const displayError = localError ?? submitError;

  return (
    <TransferScreenShell gradientClassName="bg-surface-muted">
      <TransferBackHeader
        backHref={TRANSFER_OWN_PATH}
        title="Revisar transferencia"
      />

      <div className="rounded-container-sm bg-white p-3">
        <p className="text-center text-caption font-semibold leading-5 text-[#3e494b]">
          Monto a enviar
        </p>
        <p className="mt-2 text-center text-[2.5rem] leading-[3.75rem] text-ink">
          {formatCurrency(draft.amount)}
        </p>
        <div className="mx-auto mt-3 w-fit rounded-container-sm bg-primary-tint px-2 py-0.5">
          <p className="text-caption leading-5 text-secondary">
            La transferencia se realizará de inmediato
          </p>
        </div>

        <div className="mt-3 flex flex-col gap-3">
          <AccountSummaryRow
            account={source}
            balance={source.balance}
            label="Desde"
          />
          <AccountSummaryRow
            account={target}
            label="Hacia"
            maskedNumber={formatAccountNumberReviewMasked(target)}
          />
        </div>

        <div className="mt-2 px-1">
          <DetailDividerRow
            label="Concepto"
            value={formatDescriptionForDisplay(draft.description)}
          />
          <DetailDividerRow label="Comisión" value={formatCurrency(0)} />
        </div>
      </div>

      {displayError ? (
        <p className="mt-4 text-body text-primary-deep" role="alert">
          {displayError}
        </p>
      ) : null}

      <div className="mt-auto flex flex-col gap-6 pt-8">
        <TransferPrimaryButton
          disabled={submitStatus === "loading"}
          onClick={() => void handleTransfer()}
          showArrow
        >
          {submitStatus === "loading" ? "Procesando…" : "Transferir"}
        </TransferPrimaryButton>
        <TransferTextButton
          onClick={() => {
            resetDraft();
            router.push(TRANSFER_OWN_PATH);
          }}
        >
          Cancelar
        </TransferTextButton>
      </div>
    </TransferScreenShell>
  );
}

function AccountSummaryRow({
  label,
  account,
  balance,
  maskedNumber,
}: {
  label: string;
  account: { name?: string; number: string };
  balance?: number;
  maskedNumber?: string;
}) {
  return (
    <div className="flex h-[4.625rem] items-center gap-4 rounded-container-sm px-3 py-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-input bg-primary-tint p-2">
        <TransferIcon name="wallet" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-caption leading-5 text-tertiary">{label}</p>
        <p className="text-body leading-normal text-secondary">
          {account.name ?? "Cuenta"}
        </p>
        <p className="text-caption leading-5 text-tertiary">
          {maskedNumber ?? account.number}
        </p>
      </div>
      {balance !== undefined ? (
        <p className="text-caption leading-5 font-semibold text-secondary">
          {formatCurrency(balance)}
        </p>
      ) : null}
    </div>
  );
}
