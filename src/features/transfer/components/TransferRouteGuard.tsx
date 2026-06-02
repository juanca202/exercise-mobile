"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type TransferRouteGuardProps = {
  allowed: boolean;
  redirectTo: string;
  children: React.ReactNode;
};

export function TransferRouteGuard({
  allowed,
  redirectTo,
  children,
}: TransferRouteGuardProps) {
  const router = useRouter();

  useEffect(() => {
    if (!allowed) {
      router.replace(redirectTo);
    }
  }, [allowed, redirectTo, router]);

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
