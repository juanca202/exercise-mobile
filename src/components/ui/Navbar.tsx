"use client";

import Link from "next/link";

import {
  DEMO_UNAVAILABLE_PATH,
  HOME_PATH,
  TRANSFER_PATH,
} from "@/shared/routes";

export type NavbarItemId =
  | "home"
  | "transfer"
  | "withdraw"
  | "payments"
  | "other";

type NavbarProps = {
  activeItem: NavbarItemId;
};

const NAV_ITEMS: {
  id: NavbarItemId;
  label: string;
  href: string;
}[] = [
  { id: "home", label: "Inicio", href: HOME_PATH },
  { id: "transfer", label: "Transferir", href: TRANSFER_PATH },
  { id: "withdraw", label: "Retirar", href: DEMO_UNAVAILABLE_PATH },
  { id: "payments", label: "Pagos", href: DEMO_UNAVAILABLE_PATH },
  { id: "other", label: "Otros", href: DEMO_UNAVAILABLE_PATH },
];

export function Navbar({ activeItem }: NavbarProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex justify-center px-3 pb-[max(17px,env(safe-area-inset-bottom))]"
    >
      <div
        className="pointer-events-auto grid h-nav-bar w-full max-w-nav-pill grid-cols-5 rounded-card border border-white/80 bg-white/75 shadow-[0_4px_24px_rgba(11,81,92,0.12)] backdrop-blur-xl backdrop-saturate-150"
        data-testid="navbar-pill"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeItem;

          return (
            <Link
              key={item.id}
              className={`flex h-full min-w-0 flex-col items-center justify-center gap-0.5 rounded-card px-1 text-caption transition-colors ${
                isActive
                  ? "bg-primary-subtle font-semibold text-primary"
                  : "font-normal text-tertiary"
              }`}
              href={item.href}
            >
              <NavIcon id={item.id} isActive={isActive} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function NavIcon({
  id,
  isActive,
}: {
  id: NavbarItemId;
  isActive: boolean;
}) {
  const className = `size-6 shrink-0 ${
    isActive ? "text-primary" : "text-tertiary"
  }`;

  switch (id) {
    case "home":
      return (
        <svg aria-hidden className={className} fill="none" viewBox="0 0 24 24">
          <path
            d="M4.5 10.5 12 4.75 19.5 10.5V19a1 1 0 0 1-1 1h-4.25a.75.75 0 0 1-.75-.75V14h-2.5v5.25a.75.75 0 0 1-.75.75H5.5a1 1 0 0 1-1-1v-8.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      );
    case "transfer":
      return (
        <svg aria-hidden className={className} fill="none" viewBox="0 0 24 24">
          <path
            d="M7 8h10M7 8l3-3M7 8l3 3M17 16H7M17 16l-3 3M17 16l-3-3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.4"
          />
        </svg>
      );
    case "withdraw":
      return (
        <svg aria-hidden className={className} fill="none" viewBox="0 0 24 24">
          <path
            d="M5 9h14v9H5V9ZM9 9V6h6v3M12 13v2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.4"
          />
        </svg>
      );
    case "payments":
      return (
        <svg aria-hidden className={className} fill="none" viewBox="0 0 24 24">
          <path
            d="M9 18h6M10 21h4M12 3a5.5 5.5 0 0 0-2.75 10.27V14h5.5v-.73A5.5 5.5 0 0 0 12 3Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.4"
          />
        </svg>
      );
    case "other":
      return (
        <svg aria-hidden className={className} fill="none" viewBox="0 0 24 24">
          <path
            d="M5 5h4v4H5V5Zm10 0h4v4h-4V5ZM5 15h4v4H5v-4Zm10 0h4v4h-4v-4Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.4"
          />
        </svg>
      );
  }
}
