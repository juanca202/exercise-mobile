import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LOGIN_PATH } from "@/shared/routes";

import { useAuthStore } from "../store/auth-store";
import { LogoutButton } from "./LogoutButton";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: replaceMock,
  }),
}));

vi.mock("../lib/auth-session", () => ({
  setSessionCookie: vi.fn(),
  clearSessionCookie: vi.fn(),
  readSessionCookie: vi.fn(),
}));

describe("LogoutButton", () => {
  beforeEach(() => {
    useAuthStore.setState({
      username: "demo.user",
      isAuthenticated: true,
      isHydrated: true,
    });
    replaceMock.mockClear();
  });

  it("clears session and navigates to login", async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);

    await user.click(screen.getByRole("button", { name: /cerrar sesión/i }));

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(replaceMock).toHaveBeenCalledWith(LOGIN_PATH);
  });
});
