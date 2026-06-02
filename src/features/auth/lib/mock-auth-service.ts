import {
  DEMO_PASSWORD,
  DEMO_USERNAME,
} from "../testing/auth-object-mother";
import type { AuthResult, LoginCredentials } from "./types";

export function authenticate(credentials: LoginCredentials): AuthResult {
  const username = credentials.username.trim();
  const password = credentials.password;

  if (!username || !password) {
    return {
      ok: false,
      error: {
        code: "VALIDATION",
        message: "Usuario y contraseña son obligatorios.",
      },
    };
  }

  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    return {
      ok: true,
      session: { isAuthenticated: true, username },
    };
  }

  return {
    ok: false,
    error: {
      code: "UNKNOWN",
      message: "Credenciales incorrectas.",
    },
  };
}
