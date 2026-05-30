"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps, ReactNode } from "react";

type ButtonProps = ComponentProps<typeof BaseButton> & {
  trailingIcon?: ReactNode;
};

export function Button({
  className = "",
  trailingIcon,
  children,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      className={`inline-flex h-[54px] w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-primary px-4 text-sm font-semibold text-background transition-colors hover:bg-[#1B5255] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      <span>{children}</span>
      {trailingIcon ? (
        <span className="flex shrink-0 items-center">{trailingIcon}</span>
      ) : null}
    </BaseButton>
  );
}
