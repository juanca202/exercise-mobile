"use client";

import type { ReactNode } from "react";

import { LogoutButton } from "./LogoutButton";

type AuthenticatedShellProps = {
  children: ReactNode;
};

export function AuthenticatedShell({ children }: AuthenticatedShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-[#CED4DA] bg-background px-4 py-3">
        <span className="text-base font-semibold text-[#17191F]">
          Resumen de cuentas
        </span>
        <LogoutButton label="Salir" />
      </header>
      <main className="flex-1 bg-[#EBF5F6] p-4">{children}</main>
    </div>
  );
}
