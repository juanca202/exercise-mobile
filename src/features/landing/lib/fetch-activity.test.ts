import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { demoMovements } from "../testing/landing-object-mother";
import { fetchActivity } from "./fetch-activity";

describe("fetchActivity", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => demoMovements(),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches activity from the API route", async () => {
    const movements = await fetchActivity();

    expect(fetch).toHaveBeenCalledWith("/api/activity");
    expect(movements).toHaveLength(3);
  });

  it("throws when the API responds with an error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    );

    await expect(fetchActivity()).rejects.toThrow(
      "No se pudieron cargar los movimientos",
    );
  });
});
