import { LoginPage, LoginRouteGuard } from "@/features/auth";

export default function LoginRoute() {
  return (
    <LoginRouteGuard>
      <LoginPage />
    </LoginRouteGuard>
  );
}
