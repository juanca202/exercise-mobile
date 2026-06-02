"use client";

import { useMemo, useState } from "react";

import { Error } from "@/components/ui/Error";

import { filterAccountsByChip } from "../lib/filter-accounts";
import type { AccountFilter } from "../lib/types";
import { useLandingDataStore } from "../store/landing-data-store";
import { AccountCard } from "./AccountCard";

const FILTERS: { id: AccountFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "accounts", label: "Cuentas" },
  { id: "cards", label: "Tarjetas" },
  { id: "investments", label: "Inversiones" },
];

export function AccountsCarousel() {
  const [activeFilter, setActiveFilter] = useState<AccountFilter>("all");
  const accountsState = useLandingDataStore((state) => state.accounts);
  const retryAccounts = useLandingDataStore((state) => state.retryAccounts);

  const filteredAccounts = useMemo(() => {
    if (!accountsState.data) {
      return [];
    }

    return filterAccountsByChip(accountsState.data, activeFilter);
  }, [accountsState.data, activeFilter]);

  return (
    <section aria-label="Resumen de cuentas" className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id;

          return (
            <button
              key={filter.id}
              className={`h-6 shrink-0 rounded-container-sm px-3 text-caption font-semibold transition-colors ${
                isActive
                  ? "bg-surface-muted text-primary"
                  : "border border-white text-white"
              }`}
              onClick={() => setActiveFilter(filter.id)}
              type="button"
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {accountsState.status === "loading" || accountsState.status === "idle" ? (
        <p className="text-body text-white/80">Cargando cuentas…</p>
      ) : null}

      {accountsState.status === "error" && accountsState.errorMessage ? (
        <Error message={accountsState.errorMessage} onRetry={retryAccounts} />
      ) : null}

      {accountsState.status === "success" && filteredAccounts.length === 0 ? (
        <p className="rounded-input border border-dashed border-white/40 bg-white/10 p-4 text-body text-white">
          No hay cuentas en esta categoría.
        </p>
      ) : null}

      {accountsState.status === "success" && filteredAccounts.length > 0 ? (
        <div
          className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-2"
          data-testid="accounts-carousel-track"
        >
          {filteredAccounts.map((account) => (
            <AccountCard account={account} key={account.id} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
