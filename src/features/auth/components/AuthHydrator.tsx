"use client";

import { useEffect } from "react";

import { useAuthStore } from "../store/auth-store";

interface AuthHydratorProps {
  children: React.ReactNode;
}

export function AuthHydrator({ children }: AuthHydratorProps) {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return children;
}
