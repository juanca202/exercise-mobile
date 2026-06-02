export function UpcomingPaymentsBanner() {
  return (
    <section aria-label="Pagos próximos">
      <div
        className="flex min-h-touch-min items-center justify-between rounded-modal bg-white px-3 py-4 shadow-sm"
        data-testid="upcoming-payments-banner"
      >
        <div className="flex items-center gap-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-info-surface text-info">
            <BellIcon />
          </span>
          <div className="text-caption">
            <p className="text-foreground">3 pagos próximos</p>
            <p className="font-semibold text-info">Ver pagos</p>
          </div>
        </div>
        <p className="text-caption text-foreground">$47.00</p>
      </div>
    </section>
  );
}

function BellIcon() {
  return (
    <svg aria-hidden className="size-4" fill="none" viewBox="0 0 16 16">
      <path
        d="M8 2a4 4 0 0 0-4 4v2.5L3 10.5h10L12 8.5V6a4 4 0 0 0-4-4Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M6.5 11a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
