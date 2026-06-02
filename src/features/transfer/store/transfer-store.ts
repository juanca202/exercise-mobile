import { create } from "zustand";

import { fetchAccounts } from "@/features/landing/lib/fetch-accounts";
import type { Account } from "@/features/landing/lib/types";

import { buildTransferRequest } from "../lib/build-transfer-request";
import { executeTransfer } from "../lib/execute-transfer";
import { filterEligibleTransferAccounts } from "../lib/filter-eligible-accounts";
import { mapTransferResponseToReceipt } from "../lib/map-receipt";
import type {
  TransferFormDraft,
  TransferReceipt,
  TransferSubmitStatus,
} from "../lib/types";
import { validateTransferDraft } from "../lib/validate-transfer-draft";

interface TransferState {
  draft: TransferFormDraft | null;
  lastReceipt: TransferReceipt | null;
  submitStatus: TransferSubmitStatus;
  submitError: string | null;
  accounts: Account[];
  accountsStatus: "idle" | "loading" | "success" | "error";
  setDraft: (draft: TransferFormDraft) => void;
  swapAccounts: () => void;
  resetDraft: () => void;
  clearReceipt: () => void;
  loadAccounts: () => Promise<void>;
  executeTransferFromDraft: () => Promise<TransferReceipt>;
}

export const useTransferStore = create<TransferState>((set, get) => ({
  draft: null,
  lastReceipt: null,
  submitStatus: "idle",
  submitError: null,
  accounts: [],
  accountsStatus: "idle",
  setDraft: (draft) => set({ draft }),
  swapAccounts: () => {
    const { draft } = get();
    if (!draft) {
      return;
    }

    set({
      draft: {
        ...draft,
        sourceAccountId: draft.targetAccountId,
        targetAccountId: draft.sourceAccountId,
      },
    });
  },
  resetDraft: () =>
    set({
      draft: null,
      submitStatus: "idle",
      submitError: null,
    }),
  clearReceipt: () =>
    set({
      lastReceipt: null,
      submitStatus: "idle",
      submitError: null,
    }),
  loadAccounts: async () => {
    set({ accountsStatus: "loading" });
    try {
      const accounts = filterEligibleTransferAccounts(await fetchAccounts());
      set({ accounts, accountsStatus: "success" });
    } catch {
      set({ accountsStatus: "error", accounts: [] });
    }
  },
  executeTransferFromDraft: async () => {
    const { draft, accounts } = get();

    if (!draft) {
      throw new Error("No hay borrador de transferencia");
    }

    const validation = validateTransferDraft(draft, accounts);
    if (!validation.valid) {
      throw new Error(validation.message ?? "Datos inválidos");
    }

    set({ submitStatus: "loading", submitError: null });

    try {
      const request = buildTransferRequest(draft, accounts);
      const response = await executeTransfer(request);
      const receipt = mapTransferResponseToReceipt(draft, accounts, response);

      set({
        lastReceipt: receipt,
        submitStatus: "idle",
        submitError: null,
      });

      await get().loadAccounts();

      return receipt;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo completar la transferencia";

      set({
        submitStatus: "error",
        submitError: message,
      });

      throw error;
    }
  },
}));
