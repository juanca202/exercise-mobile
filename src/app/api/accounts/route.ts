import { NextResponse } from "next/server";

import { getDemoAccounts } from "@/shared/demo/accounts-state";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get("fail") === "1") {
    return NextResponse.json(
      { message: "Error simulado al cargar cuentas" },
      { status: 500 },
    );
  }

  return NextResponse.json(getDemoAccounts());
}
