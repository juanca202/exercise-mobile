import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { TRANSFER_OWN_PATH } from "@/shared/routes";

import { TransferTypeScreen } from "./TransferTypeScreen";

describe("TransferTypeScreen", () => {
  it("shows transfer type options", () => {
    render(<TransferTypeScreen />);

    expect(screen.getByRole("link", { name: /entre mis cuentas/i })).toHaveAttribute(
      "href",
      TRANSFER_OWN_PATH,
    );
    expect(screen.getByRole("button", { name: /a terceros/i })).toBeInTheDocument();
  });

  it("shows notice for third party without navigating", async () => {
    const user = userEvent.setup();
    render(<TransferTypeScreen />);

    await user.click(screen.getByRole("button", { name: /a terceros/i }));

    expect(
      screen.getByText(/no está disponible en la demostración/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /entre mis cuentas/i })).toHaveAttribute(
      "href",
      TRANSFER_OWN_PATH,
    );
  });
});
