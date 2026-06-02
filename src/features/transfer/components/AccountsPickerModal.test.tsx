import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { eligibleAccountsMother } from "../testing/transfer-object-mother";
import { AccountsPickerModal } from "./AccountsPickerModal";

describe("AccountsPickerModal", () => {
  it("lists accounts and selects eligible row", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onClose = vi.fn();

    render(
      <AccountsPickerModal
        accounts={eligibleAccountsMother}
        onClose={onClose}
        onSelect={onSelect}
        open
        selectedAccountId="acc-001"
      />,
    );

    expect(screen.getByRole("dialog", { name: /cuentas/i })).toBeInTheDocument();
    expect(screen.getByText("Gastos")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /departamento/i }));

    expect(onSelect).toHaveBeenCalledWith("acc-002");
    expect(onClose).toHaveBeenCalled();
  });

  it("disables zero balance account", () => {
    render(
      <AccountsPickerModal
        accounts={eligibleAccountsMother}
        onClose={vi.fn()}
        onSelect={vi.fn()}
        open
      />,
    );

    expect(screen.getByRole("button", { name: /cuenta corriente/i })).toBeDisabled();
  });

  it("closes without selection when pressing backdrop", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <AccountsPickerModal
        accounts={eligibleAccountsMother}
        onClose={onClose}
        onSelect={vi.fn()}
        open
      />,
    );

    await user.click(screen.getByLabelText(/cerrar selector de cuentas/i));

    expect(onClose).toHaveBeenCalled();
  });
});
