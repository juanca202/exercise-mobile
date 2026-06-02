import type { Account } from "@/features/landing/lib/types";

import type { TransferFormDraft } from "./types";
import { validateTransferDraft } from "./validate-transfer-draft";

export function isDraftValidForReview(
  draft: TransferFormDraft | null,
  accounts: Account[],
): boolean {
  if (!draft) {
    return false;
  }

  return validateTransferDraft(draft, accounts).valid;
}
