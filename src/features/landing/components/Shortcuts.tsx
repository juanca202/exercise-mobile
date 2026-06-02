import Link from "next/link";

import { DEMO_UNAVAILABLE_PATH } from "@/shared/routes";

import { SectionHeading } from "./SectionHeading";

const FREQUENT_PAYMENTS = [
  { id: "transfer", label: "Transferencias", href: DEMO_UNAVAILABLE_PATH },
  { id: "services", label: "Servicios", href: DEMO_UNAVAILABLE_PATH },
  { id: "qr", label: "Pagos QR", href: DEMO_UNAVAILABLE_PATH },
] as const;

export function Shortcuts() {
  return (
    <section aria-label="Pagos frecuentes" className="space-y-3">
      <SectionHeading emphasis="frecuentes" muted="Pagos" />
      <div className="flex gap-8 overflow-x-auto px-1.5 pb-1">
        {FREQUENT_PAYMENTS.map((shortcut) => (
          <Link
            className="flex w-14 shrink-0 flex-col items-center gap-1 text-center"
            href={shortcut.href}
            key={shortcut.id}
          >
            <span className="flex size-shortcut-circle items-center justify-center rounded-full border border-surface-muted bg-white">
              <ShortcutIcon id={shortcut.id} />
            </span>
            <span className="text-caption text-foreground">{shortcut.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ShortcutIcon({ id }: { id: (typeof FREQUENT_PAYMENTS)[number]["id"] }) {
  const className = "size-shortcut-glyph text-primary";

  if (id === "transfer") {
    return (
      <svg aria-hidden className={className} fill="none" viewBox="0 0 24 24">
        <path
          d="M7 7h11M7 7l3-3M7 7l3 3M17 17H6M17 17l-3 3M17 17l-3-3"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  if (id === "services") {
    return (
      <svg aria-hidden className={className} fill="none" viewBox="0 0 24 24">
        <path
          d="M9 18h6M10 22h4M12 2a6 6 0 0 0-3 11.31V15h6v-1.69A6 6 0 0 0 12 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden className={className} fill="none" viewBox="0 0 24 24">
      <rect
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        width="14"
        x="5"
        y="5"
      />
      <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
