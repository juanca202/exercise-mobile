import { NextResponse } from "next/server";

import { mockMovements } from "@/features/landing/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get("fail") === "1") {
    return NextResponse.json(
      { message: "Error simulado al cargar movimientos" },
      { status: 500 },
    );
  }

  return NextResponse.json(mockMovements);
}
