"use client";

import { Error } from "@/components/ui/Error";

import { formatCurrency } from "../lib/format-currency";
import { formatMovementDateParts } from "../lib/format-movement-date";
import { formatRelativeDate } from "../lib/format-relative-date";
import { useLandingDataStore } from "../store/landing-data-store";
import { SectionHeading } from "./SectionHeading";

export function MovementsList() {
  const activityState = useLandingDataStore((state) => state.activity);
  const retryActivity = useLandingDataStore((state) => state.retryActivity);

  return (
    <section aria-label="Actividad reciente" className="space-y-3">
      <div className="flex items-center justify-between">
        <SectionHeading emphasis="reciente" muted="Actividad" />
        <button
          aria-label="Calendario de actividad"
          className="flex size-8 items-center justify-center rounded-card bg-white"
          type="button"
        >
          <CalendarIcon />
        </button>
      </div>

      {activityState.status === "loading" || activityState.status === "idle" ? (
        <p className="text-body text-tertiary">Cargando movimientos…</p>
      ) : null}

      {activityState.status === "error" && activityState.errorMessage ? (
        <Error message={activityState.errorMessage} onRetry={retryActivity} />
      ) : null}

      {activityState.status === "success" &&
      activityState.data &&
      activityState.data.length === 0 ? (
        <p className="rounded-input border border-dashed border-border bg-white p-4 text-body text-tertiary">
          No hay movimientos recientes para mostrar.
        </p>
      ) : null}

      {activityState.status === "success" &&
      activityState.data &&
      activityState.data.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {activityState.data.map((movement, index) => {
            const { day, month } = formatMovementDateParts(movement.date);
            const relativeDate = formatRelativeDate(movement.date);

            return (
              <li
                className="flex min-h-touch-min items-center justify-between rounded-input border-b border-surface-muted bg-white px-4 py-3"
                key={`${movement.date}-${movement.description}-${index}`}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    aria-label={`Fecha: ${relativeDate}`}
                    className="flex w-6 shrink-0 flex-col items-center text-center"
                  >
                    <span className="text-h3 font-semibold text-primary">
                      {day}
                    </span>
                    <span className="text-caption text-tertiary">{month}</span>
                    <span className="sr-only">{relativeDate}</span>
                  </div>
                  <p className="truncate text-caption text-foreground">
                    {movement.description}
                  </p>
                </div>
                <p className="shrink-0 text-caption font-semibold text-secondary">
                  {formatCurrency(movement.amount)}
                </p>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden className="size-4 text-primary" fill="none" viewBox="0 0 16 16">
      <rect
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
        width="12"
        x="2"
        y="3"
      />
      <path d="M2 6h12M5 1.5v2M11 1.5v2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
