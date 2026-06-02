"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  TRANSFER_PATH,
  TRANSFER_REVIEW_PATH,
} from "@/shared/routes";

import { useTransferStore } from "../store/transfer-store";
import { validateTransferDraft } from "../lib/validate-transfer-draft";
import { AccountPickerCard } from "./AccountPickerCard";
import { AccountsPickerModal } from "./AccountsPickerModal";
import { SwapAccountsButton } from "./SwapAccountsButton";
import { TransferAmountInput } from "./TransferAmountInput";
import {
  TRANSFER_GRADIENT_ENTER,
  TransferBackHeader,
  TransferPrimaryButton,
  TransferScreenShell,
  TransferTextButton,
} from "./transfer-ui";

type PickerTarget = "source" | "target" | null;

export function TransferEnterScreen() {
  const router = useRouter();
  const accounts = useTransferStore((state) => state.accounts);
  const accountsStatus = useTransferStore((state) => state.accountsStatus);
  const draft = useTransferStore((state) => state.draft);
  const setDraft = useTransferStore((state) => state.setDraft);
  const resetDraft = useTransferStore((state) => state.resetDraft);
  const loadAccounts = useTransferStore((state) => state.loadAccounts);

  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [amountInput, setAmountInput] = useState(
    draft?.amount ? String(draft.amount) : "",
  );
  const [descriptionInput, setDescriptionInput] = useState(
    draft?.description ?? "",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  const sourceAccount = useMemo(
    () => accounts.find((account) => account.id === draft?.sourceAccountId),
    [accounts, draft?.sourceAccountId],
  );
  const targetAccount = useMemo(
    () => accounts.find((account) => account.id === draft?.targetAccountId),
    [accounts, draft?.targetAccountId],
  );

  function syncDraftFromForm(
    overrides: Partial<{
      sourceAccountId: string;
      targetAccountId: string;
    }> = {},
  ) {
    const amount = Number.parseFloat(amountInput.replace(/[$,]/g, "")) || 0;
    setDraft({
      sourceAccountId:
        overrides.sourceAccountId ?? draft?.sourceAccountId ?? "",
      targetAccountId:
        overrides.targetAccountId ?? draft?.targetAccountId ?? "",
      amount,
      description: descriptionInput,
    });
  }

  function handleContinue() {
    const amount = Number.parseFloat(amountInput.replace(/[$,]/g, ""));
    const nextDraft = {
      sourceAccountId: draft?.sourceAccountId ?? "",
      targetAccountId: draft?.targetAccountId ?? "",
      amount,
      description: descriptionInput,
    };

    const validation = validateTransferDraft(nextDraft, accounts);
    if (!validation.valid) {
      setErrorMessage(validation.message ?? "Revisa los datos ingresados");
      return;
    }

    setDraft(nextDraft);
    setErrorMessage(null);
    router.push(TRANSFER_REVIEW_PATH);
  }

  function handleSelectAccount(accountId: string) {
    if (pickerTarget === "source") {
      syncDraftFromForm({ sourceAccountId: accountId });
    } else if (pickerTarget === "target") {
      syncDraftFromForm({ targetAccountId: accountId });
    }
    setPickerTarget(null);
  }

  return (
    <TransferScreenShell gradientClassName={TRANSFER_GRADIENT_ENTER}>
      <TransferBackHeader backHref={TRANSFER_PATH} title="Transferir" />

      {accountsStatus === "loading" ? (
        <p className="mb-4 text-body text-tertiary">Cargando cuentas…</p>
      ) : null}

      <div className="relative flex flex-col">
        <AccountPickerCard
          account={sourceAccount}
          label="Desde"
          onOpen={() => setPickerTarget("source")}
        />
        <SwapAccountsButton
          onSwap={() => {
            const amount =
              Number.parseFloat(amountInput.replace(/[$,]/g, "")) || 0;
            const current = {
              sourceAccountId: draft?.sourceAccountId ?? "",
              targetAccountId: draft?.targetAccountId ?? "",
              amount,
              description: descriptionInput,
            };
            setDraft({
              sourceAccountId: current.targetAccountId,
              targetAccountId: current.sourceAccountId,
              amount: current.amount,
              description: current.description,
            });
          }}
        />
        <AccountPickerCard
          account={targetAccount}
          label="Hacia"
          onOpen={() => setPickerTarget("target")}
        />
      </div>

      <div className="mt-10 flex flex-col gap-6">
        <TransferAmountInput onChange={setAmountInput} value={amountInput} />

        <div className="flex flex-col gap-2">
          <p className="text-body leading-normal text-[#3e494b]">
            <span className="font-semibold">Concepto</span>{" "}
            <span className="text-caption text-tertiary">(Opcional)</span>
          </p>
          <input
            className="w-full rounded-input border border-white bg-white px-4 py-4 text-body text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            onChange={(event) => setDescriptionInput(event.target.value)}
            placeholder="Ej. Pago zapatos"
            value={descriptionInput}
          />
        </div>
      </div>

      {errorMessage ? (
        <p className="mt-4 text-body text-primary-deep" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-auto flex flex-col items-center gap-6 pt-10">
        <TransferPrimaryButton onClick={handleContinue} showArrow>
          Continuar
        </TransferPrimaryButton>
        <TransferTextButton
          onClick={() => {
            resetDraft();
            router.push(TRANSFER_PATH);
          }}
        >
          Cancelar
        </TransferTextButton>
      </div>

      <AccountsPickerModal
        accounts={accounts}
        onClose={() => setPickerTarget(null)}
        onSelect={handleSelectAccount}
        open={pickerTarget !== null}
        selectedAccountId={
          pickerTarget === "source"
            ? draft?.sourceAccountId
            : pickerTarget === "target"
              ? draft?.targetAccountId
              : undefined
        }
      />
    </TransferScreenShell>
  );
}
