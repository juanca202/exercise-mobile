"use client";

import { useEffect } from "react";

import { Navbar } from "@/components/ui/Navbar";
import { useAuthStore } from "@/features/auth/store/auth-store";

import { useLandingDataStore } from "../store/landing-data-store";
import { AccountsCarousel } from "./AccountsCarousel";
import { LandingUserMenu } from "./LandingUserMenu";
import { MovementsList } from "./MovementsList";
import { Shortcuts } from "./Shortcuts";
import { UpcomingPaymentsBanner } from "./UpcomingPaymentsBanner";

const LANDING_GRADIENT =
  "linear-gradient(180deg, var(--primary-dark) 0%, var(--primary) 17.13%, var(--surface-muted) 37.02%, var(--surface-muted) 98.08%)";

export function LandingScreen() {
  const username = useAuthStore((state) => state.username);
  const loadAccounts = useLandingDataStore((state) => state.loadAccounts);
  const loadActivity = useLandingDataStore((state) => state.loadActivity);

  useEffect(() => {
    void loadAccounts();
    void loadActivity();
  }, [loadAccounts, loadActivity]);

  const displayName = username
    ? username.split(".")[0].replace(/^./, (c) => c.toUpperCase())
    : "Usuario";

  return (
    <div
      className="flex min-h-full flex-1 flex-col"
      style={{ background: LANDING_GRADIENT }}
    >
      <header className="px-6 pb-4 pt-11">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <LandingUserMenu />
            <p className="truncate text-h3 text-white">
              Hola, <span className="font-semibold">{displayName}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              aria-label="Mostrar u ocultar saldos"
              className="flex size-7 items-center justify-center text-white"
              type="button"
            >
              <EyeIcon />
            </button>
            <button
              className="flex h-7 items-center gap-1 rounded-input bg-primary-dark px-5 text-caption text-white"
              type="button"
            >
              <PlusIcon />
              Productos
            </button>
          </div>
        </div>

        <div className="mt-6">
          <AccountsCarousel />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-6 pt-6 pb-nav-clearance">
        <Shortcuts />
        <UpcomingPaymentsBanner />
        <MovementsList />
      </main>

      <Navbar activeItem="home" />
    </div>
  );
}

function EyeIcon() {
  return (
    <svg aria-hidden className="size-5" fill="none" viewBox="0 0 20 20">
      <path
        d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden className="size-3" fill="none" viewBox="0 0 12 12">
      <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
