import { NextResponse } from "next/server";

import { mockAccounts } from "@/features/landing/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get("fail") === "1") {
    return NextResponse.json(
      { message: "Error simulado al cargar cuentas" },
      { status: 500 },
    );
  }

  return NextResponse.json(mockAccounts);
}
