"use client";

import type { Account } from "@/features/landing/lib/types";
import { formatCurrency } from "@/shared/lib/format-currency";

import { TransferIcon } from "@/components/ui/TransferIcon";

import { formatAccountNumberEnter } from "./transfer-ui";

type AccountPickerCardProps = {
  label: "Desde" | "Hacia";
  account?: Account;
  onOpen: () => void;
};

export function AccountPickerCard({
  label,
  account,
  onOpen,
}: AccountPickerCardProps) {
  return (
    <button
      aria-label={label}
      className="flex h-[4.625rem] w-full items-center gap-4 rounded-container-sm bg-white px-3 py-4 text-left"
      onClick={onOpen}
      type="button"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-input bg-primary-tint p-2">
        <TransferIcon name="wallet" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-caption leading-5 text-tertiary">{label}</p>
        {account ? (
          <>
            <p className="text-body leading-normal text-secondary">
              {account.name ?? "Cuenta"}
            </p>
            <p className="text-caption leading-5 text-tertiary">
              {formatAccountNumberEnter(account)}
            </p>
          </>
        ) : (
          <p className="text-body text-tertiary">Selecciona una cuenta</p>
        )}
      </div>
      {account ? (
        <div className="flex shrink-0 items-center gap-3">
          <p className="text-caption leading-5 font-semibold text-secondary">
            {formatCurrency(account.balance)}
          </p>
          {/* Figma: icono final es siempre una flecha a la derecha */}
          <TransferIcon name="arrow-right" />
        </div>
      ) : (
        <TransferIcon name="arrow-right" />
      )}
    </button>
  );
}
