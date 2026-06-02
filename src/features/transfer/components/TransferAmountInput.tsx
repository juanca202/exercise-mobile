"use client";

import { useState } from "react";

type TransferAmountInputProps = {
  value: string;
  onChange: (value: string) => void;
};

/** Solo dígitos y un punto decimal (máx. 2 decimales). */
export function sanitizeAmountString(raw: string): string {
  const s = raw.replace(/[$,\s]/g, "").replace(/[^\d.]/g, "");
  if (!s) {
    return "";
  }

  const firstDot = s.indexOf(".");
  if (firstDot === -1) {
    return s.replace(/^0+(\d)/, "$1");
  }

  const intPart = s.slice(0, firstDot).replace(/^0+(\d)/, "$1") || "0";
  const frac = s
    .slice(firstDot + 1)
    .replace(/\./g, "")
    .slice(0, 2);
  const trailingDot = s.endsWith(".") && frac.length === 0;

  if (trailingDot) {
    return `${intPart}.`;
  }
  if (frac.length > 0) {
    return `${intPart}.${frac}`;
  }
  return intPart;
}

function formatAmountBlur(raw: string): string {
  const normalized = sanitizeAmountString(raw);
  if (!normalized || normalized === ".") {
    return "";
  }
  const amount = Number.parseFloat(normalized);
  if (Number.isNaN(amount)) {
    return normalized;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function TransferAmountInput({
  value,
  onChange,
}: TransferAmountInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [editValue, setEditValue] = useState("");

  const displayValue = isFocused
    ? editValue
    : value
      ? formatAmountBlur(value)
      : "";

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-h3 text-center leading-6 text-secondary">
        Ingresa el monto a transferir
      </p>
      <div className="w-full border-b-2 border-primary px-3 py-2">
        <input
          aria-label="Monto a transferir"
          className="w-full bg-transparent text-center text-[2.5rem] leading-[3.75rem] font-normal text-foreground outline-none"
          inputMode="decimal"
          onBlur={() => {
            const sanitized = sanitizeAmountString(editValue);
            setIsFocused(false);
            setEditValue(sanitized);
            onChange(sanitized);
          }}
          onChange={(event) => {
            const sanitized = sanitizeAmountString(event.target.value);
            setEditValue(sanitized);
            onChange(sanitized);
          }}
          onFocus={() => {
            setIsFocused(true);
            setEditValue(sanitizeAmountString(value));
          }}
          placeholder="$0.00"
          type="text"
          value={displayValue}
        />
      </div>
    </div>
  );
}
