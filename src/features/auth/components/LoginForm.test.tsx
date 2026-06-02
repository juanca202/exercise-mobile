import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HOME_PATH } from "@/shared/routes";

import { validDemoCredentials } from "../testing/auth-object-mother";
import { useAuthStore } from "../store/auth-store";
import { LoginForm } from "./LoginForm";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
  }),
}));

vi.mock("../lib/auth-session", () => ({
  setSessionCookie: vi.fn(),
  clearSessionCookie: vi.fn(),
  readSessionCookie: vi.fn(),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    useAuthStore.setState({
      username: "",
      isAuthenticated: false,
      isHydrated: false,
    });
    pushMock.mockClear();
  });

  it("shows validation errors when fields are empty", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(screen.getByText("El usuario es obligatorio")).toBeInTheDocument();
    expect(screen.getByText("La contraseña es obligatoria")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("redirects to home after successful login", async () => {
    const user = userEvent.setup();
    const credentials = validDemoCredentials();
    render(<LoginForm />);

    await user.type(
      screen.getByPlaceholderText("Alias o usuario"),
      credentials.username,
    );
    await user.type(screen.getByPlaceholderText("Contraseña"), credentials.password);
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(pushMock).toHaveBeenCalledWith(HOME_PATH);
  });

  it("shows generic error for invalid credentials", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("Alias o usuario"), "wrong.user");
    await user.type(screen.getByPlaceholderText("Contraseña"), "wrongpass");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(
      screen.getByText("Usuario o contraseña incorrectos"),
    ).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
