"use client";

import { Field as BaseField } from "@base-ui/react/field";
import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  name: string;
  children: ReactNode;
  className?: string;
};

export function Field({ label, name, children, className = "" }: FieldProps) {
  return (
    <BaseField.Root
      name={name}
      className={`flex flex-col gap-1.5 ${className}`}
    >
      <BaseField.Label className="text-sm font-normal text-[#424242]">
        {label}
      </BaseField.Label>
      {children}
    </BaseField.Root>
  );
}
