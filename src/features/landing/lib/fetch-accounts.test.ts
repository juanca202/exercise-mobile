import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { demoAccounts } from "../testing/landing-object-mother";
import { fetchAccounts } from "./fetch-accounts";

describe("fetchAccounts", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => demoAccounts(),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches accounts from the API route", async () => {
    const accounts = await fetchAccounts();

    expect(fetch).toHaveBeenCalledWith("/api/accounts");
    expect(accounts).toHaveLength(3);
  });

  it("throws when the API responds with an error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    );

    await expect(fetchAccounts()).rejects.toThrow(
      "No se pudieron cargar las cuentas",
    );
  });
});
