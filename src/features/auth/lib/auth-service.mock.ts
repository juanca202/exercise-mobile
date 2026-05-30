import type { AuthResult, LoginCredentials } from "./types";

export function validateCredentials(credentials: LoginCredentials): AuthResult {
  const username = credentials.username.trim();
  const password = credentials.password.trim();

  if (!username || !password) {
    return {
      ok: false,
      error: {
        code: "VALIDATION",
        message: "Usuario y contraseña son obligatorios.",
      },
    };
  }

  return {
    ok: true,
    session: {
      isAuthenticated: true,
      username,
    },
  };
}
