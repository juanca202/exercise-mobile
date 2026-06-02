import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

import { eligibleAccountsMother } from "../testing/transfer-object-mother";
import { useTransferStore } from "../store/transfer-store";
import { TransferEnterScreen } from "./TransferEnterScreen";

describe("TransferEnterScreen", () => {
  beforeEach(() => {
    push.mockReset();
    useTransferStore.setState({
      draft: null,
      accounts: eligibleAccountsMother,
      accountsStatus: "success",
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => eligibleAccountsMother,
      }),
    );
  });

  it("blocks continue when amount is out of range", async () => {
    const user = userEvent.setup();
    useTransferStore.getState().setDraft({
      sourceAccountId: "acc-001",
      targetAccountId: "acc-002",
      amount: 0,
      description: "",
    });

    render(<TransferEnterScreen />);

    const amountInput = screen.getByLabelText(/monto a transferir/i);
    fireEvent.change(amountInput, { target: { value: "4" } });
    await user.click(screen.getByRole("button", { name: /continuar/i }));

    expect(
      await screen.findByText(/entre \$5 y \$2000/i),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("navigates to review with valid draft", async () => {
    const user = userEvent.setup();
    useTransferStore.getState().setDraft({
      sourceAccountId: "acc-001",
      targetAccountId: "acc-002",
      amount: 0,
      description: "",
    });

    render(<TransferEnterScreen />);

    const amountInput = screen.getByLabelText(/monto a transferir/i);
    fireEvent.change(amountInput, { target: { value: "50" } });
    await user.click(screen.getByRole("button", { name: /continuar/i }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/transfer/own/review");
    });
  });
});
