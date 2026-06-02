import { describe, expect, it } from "vitest";

import { demoAccounts } from "../testing/landing-object-mother";
import { filterAccountsByChip } from "./filter-accounts";

describe("filterAccountsByChip", () => {
  const accounts = demoAccounts();

  it("returns all accounts for Todos", () => {
    expect(filterAccountsByChip(accounts, "all")).toHaveLength(3);
  });

  it("filters saving and checking for Cuentas", () => {
    const filtered = filterAccountsByChip(accounts, "accounts");
    expect(filtered).toHaveLength(2);
    expect(filtered.every((a) => a.type === "saving" || a.type === "checking")).toBe(
      true,
    );
  });

  it("filters credit cards for Tarjetas", () => {
    expect(filterAccountsByChip(accounts, "cards")).toHaveLength(1);
  });

  it("returns empty list for Inversiones in demo", () => {
    expect(filterAccountsByChip(accounts, "investments")).toEqual([]);
  });
});
