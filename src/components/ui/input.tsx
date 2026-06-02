"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps, ReactNode } from "react";

type InputProps = ComponentProps<typeof BaseInput> & {
  variant?: "default" | "auth" | "login";
  endAdornment?: ReactNode;
};

const defaultClasses =
  "w-full rounded-input border border-border px-4 py-3 text-input text-charcoal placeholder:text-placeholder outline-none focus:border-primary focus:text-charcoal focus:ring-1 focus:ring-primary";

const authClasses =
  "w-full rounded-input border border-white bg-white px-4 py-3 text-input text-charcoal placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary";

function isAuthVariant(variant: InputProps["variant"]) {
  return variant === "auth" || variant === "login";
}

export function Input({
  className = "",
  variant = "default",
  endAdornment,
  ...props
}: InputProps) {
  const base = isAuthVariant(variant) ? authClasses : defaultClasses;
  const inputClassName = endAdornment
    ? `${base} pr-12 ${className}`
    : `${base} ${className}`;

  if (endAdornment) {
    return (
      <div className="relative">
        <BaseInput className={inputClassName} {...props} />
        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          {endAdornment}
        </div>
      </div>
    );
  }

  return <BaseInput className={inputClassName} {...props} />;
}
