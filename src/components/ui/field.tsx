"use client";

import { Field as BaseField } from "@base-ui/react/field";
import type { ComponentProps, ReactNode } from "react";

type FieldProps = ComponentProps<typeof BaseField.Root> & {
  label: string;
  children: ReactNode;
};

export function Field({ label, children, className = "", ...props }: FieldProps) {
  return (
    <BaseField.Root className={`flex flex-col gap-1 ${className}`} {...props}>
      <BaseField.Label className="text-body font-medium text-label">
        {label}
      </BaseField.Label>
      {children}
    </BaseField.Root>
  );
}
