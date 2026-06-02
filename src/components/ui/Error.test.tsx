import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Error } from "./Error";

describe("Error", () => {
  it("renders message and invokes onRetry when clicking Reintentar", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <Error message="No se pudieron cargar las cuentas" onRetry={onRetry} />,
    );

    expect(
      screen.getByText("No se pudieron cargar las cuentas"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reintentar/i }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("supports custom retry label", () => {
    render(
      <Error
        message="Error"
        onRetry={() => undefined}
        retryLabel="Intentar de nuevo"
      />,
    );

    expect(
      screen.getByRole("button", { name: /intentar de nuevo/i }),
    ).toBeInTheDocument();
  });
});
