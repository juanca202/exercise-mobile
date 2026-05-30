"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps } from "react";

type InputProps = ComponentProps<typeof BaseInput>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <BaseInput
      className={`h-[52px] w-full rounded-lg border border-background bg-background px-4 py-[17px] text-sm text-foreground outline-none placeholder:text-tertiary-text focus:border-primary focus:ring-2 focus:ring-[#AACCCC] ${className}`}
      {...props}
    />
  );
}
