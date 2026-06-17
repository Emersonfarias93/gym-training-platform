import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/services/auth/server";

export async function GET() {
  const session = await getServerAuthSession();

  return NextResponse.json({
    authenticated: Boolean(session),
    user: session?.user ?? null
  });
}
