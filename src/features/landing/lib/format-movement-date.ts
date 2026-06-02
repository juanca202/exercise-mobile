const MONTH_LABELS = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
] as const;

export function formatMovementDateParts(isoDate: string): {
  day: string;
  month: string;
} {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return { day: "--", month: "---" };
  }

  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: MONTH_LABELS[date.getMonth()],
  };
}
