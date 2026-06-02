const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatRelativeDate(isoDate: string, now: Date = new Date()): string {
  const target = new Date(isoDate);

  if (Number.isNaN(target.getTime())) {
    return "fecha no disponible";
  }

  const diffDays = Math.round(
    (startOfDay(now).getTime() - startOfDay(target).getTime()) / DAY_MS,
  );

  if (diffDays <= 0) {
    return "hoy";
  }

  if (diffDays === 1) {
    return "ayer";
  }

  return `hace ${diffDays} días`;
}
