import { describe, expect, it } from "vitest";

import { resetDemoAccounts } from "@/shared/demo/accounts-state";

import { POST } from "./route";

describe("POST /api/transfer", () => {
  it("returns receipt on valid transfer", async () => {
    resetDemoAccounts();

    const response = await POST(
      new Request("http://localhost/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceAccountNumber: "001234567890",
          targetAccountNumber: "009876543210",
          routerNumber: "021000021",
          amount: 10,
          description: "Prueba",
        }),
      }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.receiptNumber).toBeTruthy();
    expect(body.executedAt).toBeTruthy();
  });

  it("rejects same account numbers", async () => {
    resetDemoAccounts();

    const response = await POST(
      new Request("http://localhost/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceAccountNumber: "001234567890",
          targetAccountNumber: "001234567890",
          routerNumber: "021000021",
          amount: 10,
          description: "Prueba",
        }),
      }),
    );

    expect(response.status).toBe(400);
  });
});
