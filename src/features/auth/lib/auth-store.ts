"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { validateCredentials } from "./auth-service.mock";
import { clearSessionCookie, setSessionCookie } from "./session-cookie";
import type { AuthSession, LoginCredentials } from "./types";

type AuthState = AuthSession & {
  login: (credentials: LoginCredentials) => { ok: boolean; message?: string };
  logout: () => void;
};

const initialSession: AuthSession = {
  isAuthenticated: false,
  username: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialSession,
      login: (credentials) => {
        const result = validateCredentials(credentials);

        if (!result.ok) {
          return { ok: false, message: result.error.message };
        }

        set(result.session);
        setSessionCookie();
        return { ok: true };
      },
      logout: () => {
        set(initialSession);
        clearSessionCookie();
      },
    }),
    {
      name: "auth:demo:v1",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        username: state.username,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.isAuthenticated) {
          setSessionCookie();
        }
      },
    },
  ),
);
