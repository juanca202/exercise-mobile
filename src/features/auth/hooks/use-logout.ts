"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { LOGIN_PATH } from "@/shared/routes";

import { useAuthStore } from "../store/auth-store";

export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return useCallback(() => {
    logout();
    router.replace(LOGIN_PATH);
  }, [logout, router]);
}
