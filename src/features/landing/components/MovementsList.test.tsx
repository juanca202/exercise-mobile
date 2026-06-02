import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { demoMovements } from "../testing/landing-object-mother";
import { useLandingDataStore } from "../store/landing-data-store";
import { MovementsList } from "./MovementsList";

describe("MovementsList", () => {
  beforeEach(() => {
    useLandingDataStore.setState({
      accounts: { status: "idle", data: null, errorMessage: null },
      activity: { status: "idle", data: null, errorMessage: null },
    });
  });

  it("shows movements with relative dates and signed amounts", () => {
    useLandingDataStore.setState({
      activity: {
        status: "success",
        data: demoMovements(),
        errorMessage: null,
      },
    });

    render(<MovementsList />);

    expect(screen.getByText("Transferencia recibida")).toBeInTheDocument();
    expect(screen.getByText(/-\$42\.75/)).toBeInTheDocument();
  });

  it("shows empty state in Spanish", () => {
    useLandingDataStore.setState({
      activity: {
        status: "success",
        data: [],
        errorMessage: null,
      },
    });

    render(<MovementsList />);

    expect(
      screen.getByText(/no hay movimientos recientes/i),
    ).toBeInTheDocument();
  });

  it("shows error with retry", async () => {
    const user = userEvent.setup();
    const retryActivity = vi.fn();
    useLandingDataStore.setState({
      activity: {
        status: "error",
        data: null,
        errorMessage: "No se pudieron cargar los movimientos",
      },
      retryActivity,
    });

    render(<MovementsList />);

    await user.click(screen.getByRole("button", { name: /reintentar/i }));

    expect(retryActivity).toHaveBeenCalled();
  });
});
