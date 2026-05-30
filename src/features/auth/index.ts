export { LoginForm } from "./components/LoginForm";
export { LoginPage } from "./components/LoginPage";
export { LogoutButton } from "./components/LogoutButton";
export { AuthenticatedShell } from "./components/AuthenticatedShell";
export { LoginRouteGuard } from "./components/LoginRouteGuard";
export { ProtectedPageClient } from "./components/ProtectedPageClient";
export { validateCredentials } from "./lib/auth-service.mock";
export { resolveAuthRedirect } from "./lib/auth-redirect";
export { PROTECTED_ROUTES, isProtectedPath } from "./lib/protected-routes";
export { SESSION_COOKIE_NAME } from "./lib/session-cookie";
export { useAuthStore } from "./lib/auth-store";
export type {
  AuthError,
  AuthResult,
  AuthSession,
  LoginCredentials,
  ProtectedRouteConfig,
} from "./lib/types";
