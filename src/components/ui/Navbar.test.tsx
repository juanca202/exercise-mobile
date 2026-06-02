import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  DEMO_UNAVAILABLE_PATH,
  HOME_PATH,
  TRANSFER_PATH,
} from "@/shared/routes";

import { Navbar } from "./Navbar";

describe("Navbar", () => {
  it("renders five navigation items in Spanish", () => {
    render(<Navbar activeItem="home" />);

    expect(screen.getByRole("link", { name: /inicio/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /transferir/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /retirar/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /pagos/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /otros/i })).toBeInTheDocument();
  });

  it("highlights Inicio when active on home", () => {
    render(<Navbar activeItem="home" />);

    expect(screen.getByTestId("navbar-pill")).toBeInTheDocument();

    const homeLink = screen.getByRole("link", { name: /inicio/i });
    expect(homeLink).toHaveClass(
      "bg-primary-subtle",
      "text-primary",
      "font-semibold",
    );
  });

  it("routes transfer and secondary items to placeholder in demo", () => {
    render(<Navbar activeItem="home" />);

    expect(screen.getByRole("link", { name: /inicio/i })).toHaveAttribute(
      "href",
      HOME_PATH,
    );
    expect(screen.getByRole("link", { name: /transferir/i })).toHaveAttribute(
      "href",
      TRANSFER_PATH,
    );
    expect(screen.getByRole("link", { name: /retirar/i })).toHaveAttribute(
      "href",
      DEMO_UNAVAILABLE_PATH,
    );
  });
});
