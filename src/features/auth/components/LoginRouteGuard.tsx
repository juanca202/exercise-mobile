"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { HOME_PATH } from "@/shared/constants/routes";

import { useAuthStore } from "../lib/auth-store";

type LoginRouteGuardProps = {
  children: ReactNode;
};

export function LoginRouteGuard({ children }: LoginRouteGuardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(HOME_PATH);
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
