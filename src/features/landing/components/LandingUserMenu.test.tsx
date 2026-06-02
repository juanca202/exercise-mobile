import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { LOGIN_PATH } from "@/shared/routes";

import { LandingUserMenu } from "./LandingUserMenu";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: replaceMock,
  }),
}));

vi.mock("@/features/auth/lib/auth-session", () => ({
  setSessionCookie: vi.fn(),
  clearSessionCookie: vi.fn(),
  readSessionCookie: vi.fn(),
}));

describe("LandingUserMenu", () => {
  beforeEach(() => {
    useAuthStore.setState({
      username: "demo.user",
      isAuthenticated: true,
      isHydrated: true,
    });
    replaceMock.mockClear();
  });

  it("opens menu and logs out on Cerrar sesión", async () => {
    const user = userEvent.setup();
    render(
      <div className="root">
        <LandingUserMenu />
      </div>,
    );

    const trigger = screen.getByRole("button", { name: /menú de usuario/i });
    trigger.focus();
    await user.keyboard("{Enter}");

    await user.click(await screen.findByRole("menuitem", { name: /cerrar sesión/i }));

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(replaceMock).toHaveBeenCalledWith(LOGIN_PATH);
  });
});
