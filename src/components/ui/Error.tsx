"use client";

import { Button } from "@/components/ui/Button";

type ErrorProps = {
  message: string;
  onRetry: () => void;
  retryLabel?: string;
};

export function Error({
  message,
  onRetry,
  retryLabel = "Reintentar",
}: ErrorProps) {
  return (
    <div
      className="rounded-input border border-border bg-white p-4 text-center"
      role="alert"
    >
      <p className="text-body text-muted">{message}</p>
      <div className="mt-3">
        <Button className="mx-auto" onClick={onRetry} type="button">
          {retryLabel}
        </Button>
      </div>
    </div>
  );
}
