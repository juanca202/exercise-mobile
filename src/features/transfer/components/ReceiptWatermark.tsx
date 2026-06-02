import type { CSSProperties } from "react";

/**
 * Marca de agua diagonal del comprobante (Figma 1:2984 — patrón de logo repetido).
 */
export function ReceiptWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-container-sm"
    >
      <div
        className="absolute -left-1/4 -top-1/4 h-[200%] w-[200%] opacity-50"
        style={
          {
            backgroundImage: "url(/images/transfer/logo-wordmark.png)",
            backgroundRepeat: "repeat",
            backgroundSize: "130px 31px",
            transform: "rotate(-30deg)",
          } satisfies CSSProperties
        }
      />
    </div>
  );
}
