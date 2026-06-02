import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DEMO_UNAVAILABLE_PATH } from "@/shared/routes";

import { Shortcuts } from "./Shortcuts";

describe("Shortcuts", () => {
  it("renders shortcut labels linking to demo placeholder", () => {
    render(<Shortcuts />);

    expect(
      screen.getByRole("link", { name: /transferencias/i }),
    ).toHaveAttribute("href", DEMO_UNAVAILABLE_PATH);
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
