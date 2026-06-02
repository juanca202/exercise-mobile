import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  sanitizeAmountString,
  TransferAmountInput,
} from "./TransferAmountInput";

describe("sanitizeAmountString", () => {
  it("allows multi-digit amounts", () => {
    expect(sanitizeAmountString("50")).toBe("50");
    expect(sanitizeAmountString("1234.56")).toBe("1234.56");
  });

  it("strips currency formatting characters", () => {
    expect(sanitizeAmountString("$1,250.50")).toBe("1250.50");
  });
});

describe("TransferAmountInput", () => {
  it("lets user type a full amount digit by digit", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TransferAmountInput onChange={onChange} value="" />);

    const input = screen.getByLabelText(/monto a transferir/i);
    await user.click(input);
    await user.type(input, "150");

    expect(onChange).toHaveBeenLastCalledWith("150");
  });
});
