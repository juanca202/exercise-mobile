import type { Movement } from "./types";

export async function fetchActivity(): Promise<Movement[]> {
  const response = await fetch("/api/activity");

  if (!response.ok) {
    throw new Error("No se pudieron cargar los movimientos");
  }

  return response.json() as Promise<Movement[]>;
}
