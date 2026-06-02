import { create } from "zustand";

import { fetchAccounts } from "../lib/fetch-accounts";
import { fetchActivity } from "../lib/fetch-activity";
import type { Account, Movement, SectionStatus } from "../lib/types";

interface SectionState<T> {
  status: SectionStatus;
  data: T | null;
  errorMessage: string | null;
}

const initialSection = <T>(): SectionState<T> => ({
  status: "idle",
  data: null,
  errorMessage: null,
});

interface LandingDataState {
  accounts: SectionState<Account[]>;
  activity: SectionState<Movement[]>;
  loadAccounts: () => Promise<void>;
  loadActivity: () => Promise<void>;
  retryAccounts: () => Promise<void>;
  retryActivity: () => Promise<void>;
}

async function loadSection<T>(
  fetcher: () => Promise<T>,
  setLoading: () => void,
  setSuccess: (data: T) => void,
  setError: (message: string) => void,
): Promise<void> {
  setLoading();

  try {
    const data = await fetcher();
    setSuccess(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ocurrió un error inesperado";
    setError(message);
  }
}

export const useLandingDataStore = create<LandingDataState>((set, get) => ({
  accounts: initialSection<Account[]>(),
  activity: initialSection<Movement[]>(),

  loadAccounts: async () => {
    await loadSection(
      fetchAccounts,
      () =>
        set((state) => ({
          accounts: {
            ...state.accounts,
            status: "loading",
            errorMessage: null,
          },
        })),
      (data) =>
        set({
          accounts: { status: "success", data, errorMessage: null },
        }),
      (errorMessage) =>
        set({
          accounts: {
            status: "error",
            data: null,
            errorMessage,
          },
        }),
    );
  },

  loadActivity: async () => {
    await loadSection(
      fetchActivity,
      () =>
        set((state) => ({
          activity: {
            ...state.activity,
            status: "loading",
            errorMessage: null,
          },
        })),
      (data) =>
        set({
          activity: { status: "success", data, errorMessage: null },
        }),
      (errorMessage) =>
        set({
          activity: {
            status: "error",
            data: null,
            errorMessage,
          },
        }),
    );
  },

  retryAccounts: async () => {
    await get().loadAccounts();
  },

  retryActivity: async () => {
    await get().loadActivity();
  },
}));
