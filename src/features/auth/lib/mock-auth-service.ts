import {
  DEMO_PASSWORD,
  DEMO_USERNAME,
} from "../testing/auth-object-mother";
import type { AuthResult, LoginCredentials } from "./types";

export function authenticate(credentials: LoginCredentials): AuthResult {
  const username = credentials.username.trim();
  const password = credentials.password;

  if (!username || !password) {
    return { success: false, error: "VALIDATION_ERROR" };
  }

  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    return { success: true, session: { username } };
  }

  return { success: false, error: "INVALID_CREDENTIALS" };
}
