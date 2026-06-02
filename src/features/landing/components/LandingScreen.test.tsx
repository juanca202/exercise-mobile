import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/features/auth/store/auth-store";

import * as landingDataStore from "../store/landing-data-store";
import { LandingScreen } from "./LandingScreen";

vi.mock("../store/landing-data-store", () => ({
  useLandingDataStore: vi.fn(),
}));

vi.mock("./AccountsCarousel", () => ({
  AccountsCarousel: () => <div data-testid="accounts-carousel" />,
}));

vi.mock("./MovementsList", () => ({
  MovementsList: () => <div data-testid="movements-list" />,
}));

vi.mock("./Shortcuts", () => ({
  Shortcuts: () => <div data-testid="shortcuts" />,
}));

vi.mock("./LandingUserMenu", () => ({
  LandingUserMenu: () => <button type="button">Menú de usuario</button>,
}));

vi.mock("@/components/ui/Navbar", () => ({
  Navbar: () => <nav data-testid="navbar" />,
}));

describe("LandingScreen", () => {
  const loadAccounts = vi.fn();
  const loadActivity = vi.fn();

  beforeEach(() => {
    useAuthStore.setState({
      username: "demo.user",
      isAuthenticated: true,
      isHydrated: true,
    });
    loadAccounts.mockClear();
    loadActivity.mockClear();
    vi.mocked(landingDataStore.useLandingDataStore).mockImplementation(
      (selector) =>
        selector({
          loadAccounts,
          loadActivity,
        } as never),
    );
  });

  it("loads accounts and activity on mount", () => {
    render(<LandingScreen />);

    expect(loadAccounts).toHaveBeenCalled();
    expect(loadActivity).toHaveBeenCalled();
    expect(screen.getByTestId("accounts-carousel")).toBeInTheDocument();
    expect(screen.getByTestId("movements-list")).toBeInTheDocument();
    expect(screen.getByText(/hola,/i)).toBeInTheDocument();
  });
});
