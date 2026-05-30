"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { LOGIN_PATH } from "@/shared/constants/routes";

import { useAuthStore } from "../lib/auth-store";

type ProtectedPageClientProps = {
  children: ReactNode;
};

export function ProtectedPageClient({ children }: ProtectedPageClientProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(LOGIN_PATH);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
