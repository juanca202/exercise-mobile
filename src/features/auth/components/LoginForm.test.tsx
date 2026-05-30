import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SESSION_COOKIE_NAME } from "../lib/session-cookie";
import { useAuthStore } from "../lib/auth-store";
import { LoginForm } from "./LoginForm";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/components/ui/auth-icon", () => ({
  AuthIcon: () => <span data-testid="auth-icon" />,
}));

describe("LoginForm", () => {
  beforeEach(() => {
    pushMock.mockClear();
    localStorage.clear();
    document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`;
    useAuthStore.setState({
      isAuthenticated: false,
      username: null,
    });
  });

  it("requires username and password before submitting", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(pushMock).not.toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("logs in and navigates home with valid credentials", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(
      screen.getByPlaceholderText(/alias o usuario/i),
      "demo.user",
    );
    await user.type(screen.getByPlaceholderText(/contraseña/i), "secret");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
