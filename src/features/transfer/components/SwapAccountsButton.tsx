"use client";

import { TransferIcon } from "@/components/ui/TransferIcon";

type SwapAccountsButtonProps = {
  onSwap: () => void;
};

export function SwapAccountsButton({ onSwap }: SwapAccountsButtonProps) {
  return (
    <div className="relative z-10 -my-3 flex justify-center">
      <button
        aria-label="Intercambiar cuentas origen y destino"
        className="flex size-10 items-center justify-center rounded-[1.75rem] bg-primary-tint p-2 shadow-sm"
        onClick={onSwap}
        type="button"
      >
        <TransferIcon name="angles-down" />
      </button>
    </div>
  );
}
