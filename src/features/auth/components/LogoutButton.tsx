"use client";

import { Button } from "@/components/ui/Button";

import { useLogout } from "../hooks/use-logout";

export function LogoutButton() {
  const handleLogout = useLogout();

  return (
    <Button onClick={handleLogout} type="button">
      Cerrar sesión
    </Button>
  );
}
