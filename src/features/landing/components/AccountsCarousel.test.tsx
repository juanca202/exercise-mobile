import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { demoAccounts } from "../testing/landing-object-mother";
import { useLandingDataStore } from "../store/landing-data-store";
import { AccountsCarousel } from "./AccountsCarousel";

describe("AccountsCarousel", () => {
  beforeEach(() => {
    useLandingDataStore.setState({
      accounts: { status: "idle", data: null, errorMessage: null },
      activity: { status: "idle", data: null, errorMessage: null },
    });
  });

  it("shows loading state", () => {
    useLandingDataStore.setState({
      accounts: { status: "loading", data: null, errorMessage: null },
    });

    render(<AccountsCarousel />);

    expect(screen.getByText(/cargando cuentas/i)).toBeInTheDocument();
  });

  it("renders account cards when data loads", () => {
    useLandingDataStore.setState({
      accounts: {
        status: "success",
        data: demoAccounts(),
        errorMessage: null,
      },
    });

    render(<AccountsCarousel />);

    expect(screen.getAllByTestId("account-card")).toHaveLength(3);
    expect(screen.getByText(/7890/)).toBeInTheDocument();
  });

  it("shows error with retry action", async () => {
    const user = userEvent.setup();
    const retryAccounts = vi.fn();
    useLandingDataStore.setState({
      accounts: {
        status: "error",
        data: null,
        errorMessage: "No se pudieron cargar las cuentas",
      },
      retryAccounts,
    });

    render(<AccountsCarousel />);

    await user.click(screen.getByRole("button", { name: /reintentar/i }));

    expect(retryAccounts).toHaveBeenCalled();
  });

  it("filters accounts by chip selection", async () => {
    const user = userEvent.setup();
    useLandingDataStore.setState({
      accounts: {
        status: "success",
        data: demoAccounts(),
        errorMessage: null,
      },
    });

    render(<AccountsCarousel />);

    await user.click(screen.getByRole("button", { name: "Tarjetas" }));

    expect(screen.getAllByTestId("account-card")).toHaveLength(1);
  });

  it("shows empty message for Inversiones filter", async () => {
    const user = userEvent.setup();
    useLandingDataStore.setState({
      accounts: {
        status: "success",
        data: demoAccounts(),
        errorMessage: null,
      },
    });

    render(<AccountsCarousel />);

    await user.click(screen.getByRole("button", { name: "Inversiones" }));

    expect(
      screen.getByText(/no hay cuentas en esta categoría/i),
    ).toBeInTheDocument();
  });

  it("exposes horizontal scroll track for multiple cards", () => {
    useLandingDataStore.setState({
      accounts: {
        status: "success",
        data: demoAccounts(),
        errorMessage: null,
      },
    });

    render(<AccountsCarousel />);

    expect(screen.getByTestId("accounts-carousel-track")).toHaveClass(
      "overflow-x-auto",
    );
  });
});
