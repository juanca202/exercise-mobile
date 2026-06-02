export interface AuthSession {
  username: string;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export type AuthResult =
  | { success: true; session: { username: string } }
  | { success: false; error: "INVALID_CREDENTIALS" | "VALIDATION_ERROR" };
