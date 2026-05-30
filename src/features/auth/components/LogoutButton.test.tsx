import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SESSION_COOKIE_NAME } from "../lib/session-cookie";
import { useAuthStore } from "../lib/auth-store";
import { LogoutButton } from "./LogoutButton";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("LogoutButton", () => {
  beforeEach(() => {
    pushMock.mockClear();
    localStorage.clear();
    useAuthStore.getState().login({
      username: "demo.user",
      password: "secret",
    });
  });

  it("clears session and navigates to login", async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);

    await user.click(screen.getByRole("button", { name: /cerrar sesión/i }));

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(document.cookie).not.toContain(`${SESSION_COOKIE_NAME}=1`);
    expect(pushMock).toHaveBeenCalledWith("/login");
  });
});
