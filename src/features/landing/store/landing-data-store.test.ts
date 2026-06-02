import { beforeEach, describe, expect, it, vi } from "vitest";

import * as fetchAccountsModule from "../lib/fetch-accounts";
import * as fetchActivityModule from "../lib/fetch-activity";
import { demoAccounts, demoMovements } from "../testing/landing-object-mother";
import { useLandingDataStore } from "./landing-data-store";

describe("landing-data-store", () => {
  beforeEach(() => {
    useLandingDataStore.setState({
      accounts: { status: "idle", data: null, errorMessage: null },
      activity: { status: "idle", data: null, errorMessage: null },
    });
    vi.restoreAllMocks();
  });

  it("loads accounts successfully", async () => {
    vi.spyOn(fetchAccountsModule, "fetchAccounts").mockResolvedValue(
      demoAccounts(),
    );

    await useLandingDataStore.getState().loadAccounts();

    expect(useLandingDataStore.getState().accounts).toMatchObject({
      status: "success",
      data: demoAccounts(),
      errorMessage: null,
    });
  });

  it("sets accounts error without affecting activity slice", async () => {
    vi.spyOn(fetchAccountsModule, "fetchAccounts").mockRejectedValue(
      new Error("Fallo de red"),
    );

    await useLandingDataStore.getState().loadAccounts();

    expect(useLandingDataStore.getState().accounts).toMatchObject({
      status: "error",
      errorMessage: "Fallo de red",
    });
    expect(useLandingDataStore.getState().activity.status).toBe("idle");
  });

  it("retries accounts load after failure", async () => {
    const fetchSpy = vi
      .spyOn(fetchAccountsModule, "fetchAccounts")
      .mockRejectedValueOnce(new Error("Error temporal"))
      .mockResolvedValueOnce(demoAccounts());

    await useLandingDataStore.getState().loadAccounts();
    await useLandingDataStore.getState().retryAccounts();

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(useLandingDataStore.getState().accounts.status).toBe("success");
  });

  it("uses generic error message for non-Error rejections", async () => {
    vi.spyOn(fetchActivityModule, "fetchActivity").mockRejectedValue("fallo");

    await useLandingDataStore.getState().loadActivity();

    expect(useLandingDataStore.getState().activity.errorMessage).toBe(
      "Ocurrió un error inesperado",
    );
  });

  it("retries activity load after failure", async () => {
    const fetchSpy = vi
      .spyOn(fetchActivityModule, "fetchActivity")
      .mockRejectedValueOnce(new Error("Error temporal"))
      .mockResolvedValueOnce(demoMovements());

    await useLandingDataStore.getState().loadActivity();
    expect(useLandingDataStore.getState().activity.status).toBe("error");

    await useLandingDataStore.getState().retryActivity();

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(useLandingDataStore.getState().activity.status).toBe("success");
  });
});
