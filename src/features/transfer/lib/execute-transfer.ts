import type { TransferApiResponse, TransferRequest } from "./types";

export class TransferExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TransferExecutionError";
  }
}

export async function executeTransfer(
  request: TransferRequest,
): Promise<TransferApiResponse> {
  const response = await fetch("/api/transfer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const body = (await response.json()) as TransferApiResponse & {
    error?: string;
  };

  if (!response.ok) {
    throw new TransferExecutionError(
      body.error ?? "No se pudo completar la transferencia",
    );
  }

  return body;
}
