import { create } from "zustand";

import {
  clearSessionCookie,
  readSessionCookie,
  setSessionCookie,
} from "../lib/auth-session";
import { authenticate } from "../lib/mock-auth-service";
import type { AuthResult, LoginCredentials } from "../lib/types";

interface AuthState {
  username: string;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (credentials: LoginCredentials) => AuthResult;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: "",
  isAuthenticated: false,
  isHydrated: false,
  login: (credentials) => {
    const result = authenticate(credentials);

    if (result.success) {
      setSessionCookie(result.session.username);
      set({
        username: result.session.username,
        isAuthenticated: true,
      });
    }

    return result;
  },
  logout: () => {
    clearSessionCookie();
    set({
      username: "",
      isAuthenticated: false,
    });
  },
  hydrate: () => {
    const session = readSessionCookie();

    if (session) {
      set({
        username: session.username,
        isAuthenticated: true,
        isHydrated: true,
      });
      return;
    }

    set({ isHydrated: true });
  },
}));
