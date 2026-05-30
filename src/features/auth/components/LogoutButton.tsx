"use client";

import { useRouter } from "next/navigation";

import { LOGIN_PATH } from "@/shared/constants/routes";

import { useAuthStore } from "../lib/auth-store";

type LogoutButtonProps = {
  className?: string;
  label?: string;
};

export function LogoutButton({
  className = "",
  label = "Cerrar sesión",
}: LogoutButtonProps) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.push(LOGIN_PATH);
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`cursor-pointer text-sm font-medium text-primary underline-offset-2 hover:underline ${className}`}
    >
      {label}
    </button>
  );
}
