export type AuthSession = {
  isAuthenticated: boolean;
  username: string | null;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type AuthError = {
  code: "VALIDATION" | "UNKNOWN";
  message: string;
};

export type AuthResult =
  | { ok: true; session: AuthSession }
  | { ok: false; error: AuthError };

export type ProtectedRouteConfig = {
  path: string;
  label?: string;
};
