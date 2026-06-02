import { describe, expect, it } from "vitest";

import { eligibleAccountsMother, validDraftMother } from "../testing/transfer-object-mother";
import { buildTransferRequest, DEMO_ROUTER_NUMBER } from "./build-transfer-request";

describe("buildTransferRequest", () => {
  it("maps draft to API request with demo router", () => {
    const request = buildTransferRequest(
      validDraftMother({ description: "" }),
      eligibleAccountsMother,
    );

    expect(request).toEqual({
      sourceAccountNumber: "001234567890",
      targetAccountNumber: "009876543210",
      routerNumber: DEMO_ROUTER_NUMBER,
      amount: 50,
      description: "Sin concepto",
    });
  });
});
