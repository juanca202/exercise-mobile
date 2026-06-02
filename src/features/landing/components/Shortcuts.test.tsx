import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DEMO_UNAVAILABLE_PATH, TRANSFER_PATH } from "@/shared/routes";

import { Shortcuts } from "./Shortcuts";

describe("Shortcuts", () => {
  it("renders shortcut labels with transfer and demo placeholder routes", () => {
    render(<Shortcuts />);

    expect(
      screen.getByRole("link", { name: /transferencias/i }),
    ).toHaveAttribute("href", TRANSFER_PATH);
    expect(screen.getByRole("link", { name: /servicios/i })).toHaveAttribute(
      "href",
      DEMO_UNAVAILABLE_PATH,
    );
    expect(screen.getByRole("link", { name: /pagos qr/i })).toHaveAttribute(
      "href",
      DEMO_UNAVAILABLE_PATH,
    );
  });
});
