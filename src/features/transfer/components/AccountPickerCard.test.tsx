import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { eligibleAccountsMother } from "../testing/transfer-object-mother";
import { AccountPickerCard } from "./AccountPickerCard";

describe("AccountPickerCard", () => {
  it("renders selected account details", () => {
    render(
      <AccountPickerCard
        account={eligibleAccountsMother[0]}
        label="Desde"
        onOpen={vi.fn()}
      />,
    );

    expect(screen.getByText("Desde")).toBeInTheDocument();
    expect(screen.getByText("Gastos")).toBeInTheDocument();
    expect(screen.getByText(/\$1,250\.50/)).toBeInTheDocument();
  });

  it("calls onOpen when clicked", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();

    render(<AccountPickerCard label="Hacia" onOpen={onOpen} />);

    await user.click(screen.getByRole("button", { name: /hacia/i }));

    expect(onOpen).toHaveBeenCalled();
  });
});
