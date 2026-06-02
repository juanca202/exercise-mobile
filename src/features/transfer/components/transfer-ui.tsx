"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import {
  TRANSFER_LOGO_WORDMARK,
  TransferIcon,
} from "@/components/ui/TransferIcon";
import type { Account } from "@/features/landing/lib/types";
import { HOME_PATH } from "@/shared/routes";

import { accountTypeLabel } from "../lib/filter-eligible-accounts";

export const TRANSFER_GRADIENT_TYPE =
  "bg-[linear-gradient(180deg,var(--surface-muted)_49%,var(--primary-tint)_100%)]";
export const TRANSFER_GRADIENT_ENTER =
  "bg-[linear-gradient(180deg,#adcee5_0%,var(--surface-muted)_49%)]";

type TransferScreenShellProps = {
  children: ReactNode;
  gradientClassName?: string;
};

export function TransferScreenShell({
  children,
  gradientClassName = TRANSFER_GRADIENT_TYPE,
}: TransferScreenShellProps) {
  return (
    <div
      className={`flex min-h-full w-full min-w-0 flex-1 flex-col px-6 pt-14 pb-nav-clearance ${gradientClassName}`}
    >
      {children}
    </div>
  );
}

type TransferBackHeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  onBack?: () => void;
};

function TransferBackButton({
  onBack,
}: {
  onBack?: () => void;
}) {
  const router = useRouter();

  return (
    <button
      aria-label="Volver"
      className="inline-flex size-5 items-center justify-center text-foreground"
      onClick={() => (onBack ? onBack() : router.back())}
      type="button"
    >
      <TransferIcon name="arrow-left" />
    </button>
  );
}

export function TransferBackHeader({
  title,
  subtitle,
  backHref,
  onBack,
}: TransferBackHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-4">
      {backHref ? (
        <Link
          aria-label="Volver"
          className="inline-flex size-5 items-center justify-center text-foreground"
          href={backHref}
        >
          <TransferIcon name="arrow-left" />
        </Link>
      ) : (
        <TransferBackButton onBack={onBack} />
      )}
      <div className="flex flex-col gap-1">
        <h1 className="text-[1.125rem] leading-7 font-normal tracking-normal text-foreground uppercase">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-h3 leading-6 text-secondary">{subtitle}</p>
        ) : null}
      </div>
    </header>
  );
}

type TransferOptionCardProps = {
  title: string;
  description: string;
  icon: "between-accounts" | "third-party";
  onClick?: () => void;
  href?: string;
};

export function TransferOptionCard({
  title,
  description,
  icon,
  onClick,
  href,
}: TransferOptionCardProps) {
  const content = (
    <>
      <div className="flex size-12 shrink-0 items-center justify-center rounded-input bg-primary-tint">
        {icon === "between-accounts" ? (
          <TransferIcon name="arrows-retweet" />
        ) : (
          <TransferIcon name="users" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-h3 leading-6 font-semibold text-foreground">{title}</p>
        <p className="text-body leading-normal text-[#3e494b]">{description}</p>
      </div>
      <TransferIcon name="arrow-right" />
    </>
  );

  const className =
    "flex w-full items-start gap-4 rounded-container-sm bg-white p-4 text-left transition-colors hover:ring-1 hover:ring-primary/30";

  if (href) {
    return (
      <Link className={className} href={href}>
        {content}
      </Link>
    );
  }

  return (
    <button className={className} onClick={onClick} type="button">
      {content}
    </button>
  );
}

type TransferPrimaryButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  showArrow?: boolean;
  variant?: "solid" | "outline";
  className?: string;
};

export function TransferPrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
  showArrow = true,
  variant = "solid",
  className = "",
}: TransferPrimaryButtonProps) {
  const base =
    "flex h-12 w-full items-center justify-center gap-3 rounded-input px-4 text-body-bold leading-[1.375rem] font-semibold disabled:cursor-not-allowed disabled:opacity-50";
  const variantClass =
    variant === "solid"
      ? "bg-primary text-white shadow-[0_4px_4px_0_var(--on-dark-muted)]"
      : "border border-primary bg-white text-primary shadow-[0_4px_4px_0_var(--on-dark-muted)]";

  return (
    <button
      className={`${base} ${variantClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
      {showArrow ? (
        <TransferIcon
          name={
            variant === "solid" ? "arrow-right-button" : "arrow-right"
          }
        />
      ) : null}
    </button>
  );
}

export function TransferTextButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      className={`text-center text-body-bold leading-[1.375rem] font-semibold text-primary ${className}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function formatAccountNumberEnter(account: Account): string {
  const digits = account.number.replace(/\D/g, "");
  return `${accountTypeLabel(account.type)} ${digits}`;
}

export function formatAccountNumberReviewMasked(account: Account): string {
  return formatMaskedAccountNumber(account.number, account.type);
}

export function formatMaskedAccountNumber(
  number: string,
  type: Account["type"],
): string {
  const digits = number.replace(/\D/g, "");
  const lastThree = digits.slice(-3);
  return `${accountTypeLabel(type)} **** *${lastThree}`;
}

export function DetailDividerRow({
  label,
  value,
  valueClassName = "text-primary",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#eee] px-1 py-3">
      <span className="text-body leading-5 text-secondary">{label}</span>
      <span className={`text-caption leading-5 ${valueClassName}`}>{value}</span>
    </div>
  );
}

export function BankBrandMark() {
  return (
    <Image
      alt="Banco Bolivariano"
      className="h-[17px] w-auto object-contain"
      height={TRANSFER_LOGO_WORDMARK.height}
      src={TRANSFER_LOGO_WORDMARK.src}
      width={TRANSFER_LOGO_WORDMARK.width}
    />
  );
}

export function SuccessBadge() {
  return (
    <div className="flex size-[52px] items-center justify-center rounded-full border border-[#d6d6d6] bg-white shadow-sm">
      <TransferIcon name="circle-check" />
    </div>
  );
}

export function ShareIcon() {
  return <TransferIcon name="share-nodes" />;
}

export { HOME_PATH };
