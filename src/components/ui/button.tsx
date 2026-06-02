"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps, ReactNode } from "react";

import { AuthIcon } from "@/components/ui/AuthIcon";

type ButtonProps = ComponentProps<typeof BaseButton> & {
  endIcon?: ReactNode;
};

export function Button({
  className = "",
  children,
  endIcon,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      className={`inline-flex min-h-touch-min items-center justify-center gap-3 rounded-pill bg-primary px-8 py-4 text-button font-medium text-white transition-colors hover:bg-primary-deep disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      {endIcon}
    </BaseButton>
  );
}

export function LoginSubmitIcon() {
  return <AuthIcon name="login" />;
}
