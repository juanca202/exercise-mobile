"use client";

import type { Account } from "@/features/landing/lib/types";
import { formatAccountNumberDisplay } from "@/shared/lib/format-account-number";
import { formatCurrency } from "@/shared/lib/format-currency";

import {
  accountTypeLabel,
  isAccountSelectableForTransfer,
} from "../lib/filter-eligible-accounts";
import { TransferIcon } from "@/components/ui/TransferIcon";

type AccountsPickerModalProps = {
  open: boolean;
  accounts: Account[];
  selectedAccountId?: string;
  onSelect: (accountId: string) => void;
  onClose: () => void;
};

export function AccountsPickerModal({
  open,
  accounts,
  selectedAccountId,
  onSelect,
  onClose,
}: AccountsPickerModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <button
        aria-label="Cerrar selector de cuentas"
        className="absolute inset-0"
        onClick={onClose}
        type="button"
      />
      <div
        aria-labelledby="accounts-modal-title"
        aria-modal="true"
        className="relative z-10 w-full min-w-0 rounded-t-container-sm bg-surface-muted shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
        role="dialog"
      >
        <div className="flex items-center justify-between rounded-t-container-sm bg-white px-6 py-5">
          <h2
            className="text-body leading-normal text-foreground uppercase"
            id="accounts-modal-title"
          >
            Cuentas
          </h2>
          <button
            aria-label="Cerrar"
            className="inline-flex size-5 items-center justify-center text-foreground"
            onClick={onClose}
            type="button"
          >
            <CloseIcon />
          </button>
        </div>

        <ul className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto px-6 py-6">
          {accounts.map((account) => {
            const selectable = isAccountSelectableForTransfer(account);
            const isSelected = account.id === selectedAccountId;

            return (
              <li key={account.id}>
                <button
                  aria-label={account.name ?? "Cuenta"}
                  className={`flex h-[4.625rem] w-full items-center gap-4 rounded-container-sm px-3 py-4 text-left transition-colors ${
                    isSelected
                      ? "bg-primary-tint ring-1 ring-primary"
                      : selectable
                        ? "bg-white"
                        : "bg-white opacity-40"
                  }`}
                  disabled={!selectable}
                  onClick={() => {
                    onSelect(account.id);
                    onClose();
                  }}
                  type="button"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-input bg-primary-tint p-2">
                    <TransferIcon name="wallet" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-body leading-normal text-secondary">
                      {account.name ?? "Cuenta"}
                    </p>
                    <p className="text-caption leading-5 text-tertiary">
                      {accountTypeLabel(account.type)}{" "}
                      {formatAccountNumberDisplay(account.number)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-caption leading-5 font-semibold text-secondary">
                      {formatCurrency(account.balance)}
                    </p>
                    <p className="text-caption leading-5 text-tertiary">
                      Saldo disponible
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
