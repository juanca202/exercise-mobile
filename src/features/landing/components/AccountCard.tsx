import { formatAccountNumber } from "../lib/format-account-number";
import { formatCurrency } from "../lib/format-currency";
import type { Account } from "../lib/types";

type AccountCardProps = {
  account: Account;
};

function productTitle(account: Account): string {
  if (account.type === "credit-card") {
    return "Tarjeta";
  }

  if (account.name) {
    return account.name;
  }

  return account.type === "checking" ? "Cuenta corriente" : "Gastos";
}

function balanceLabel(type: Account["type"]): string {
  return type === "credit-card" ? "Total a pagar" : "Saldo";
}

function accountSubtitle(account: Account): string {
  const masked = formatAccountNumber(account.number);

  if (account.type === "credit-card") {
    return masked.replace("****", "**** ");
  }

  const prefix =
    account.type === "checking" ? "Cta. corriente" : "Cta. ahorros";
  return `${prefix}${masked.replace("****", "**** *")}`;
}

export function AccountCard({ account }: AccountCardProps) {
  if (account.type === "credit-card") {
    return (
      <article
        className="flex h-account-card w-account-card shrink-0 flex-col justify-between rounded-container-sm border border-tertiary bg-gradient-to-br from-card-dark-from to-card-dark-to p-4 text-white"
        data-testid="account-card"
      >
        <div>
          <div className="flex items-center justify-between">
            <p className="text-h3">{productTitle(account)}</p>
            <CardBrandMark />
          </div>
          <p className="mt-1 text-caption text-on-dark-muted">
            {accountSubtitle(account)}
          </p>
        </div>
        <div>
          <p className="text-h2 font-bold">{formatCurrency(account.balance)}</p>
          <p className="text-body text-on-dark-muted">
            {balanceLabel(account.type)}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article
      className="flex h-account-card w-account-card shrink-0 flex-col justify-between rounded-container-sm border border-white bg-primary-surface p-4"
      data-testid="account-card"
    >
      <div>
        <div className="flex items-center justify-between">
          <p className="text-h3 text-primary">{productTitle(account)}</p>
          <ShareIcon />
        </div>
        <p className="mt-1 text-caption text-tertiary">
          {accountSubtitle(account)}
        </p>
      </div>
      <div>
        <p className="text-h2 font-bold text-foreground">
          {formatCurrency(account.balance)}
        </p>
        <p className="text-body text-primary">{balanceLabel(account.type)}</p>
      </div>
    </article>
  );
}

function ShareIcon() {
  return (
    <svg aria-hidden className="size-6 text-primary" fill="none" viewBox="0 0 24 24">
      <circle cx="18" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 11l8-4M8 13l8 4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CardBrandMark() {
  return (
    <span
      aria-hidden
      className="rounded px-2 py-0.5 text-caption font-semibold tracking-wide bg-white/20"
    >
      VISA
    </span>
  );
}
