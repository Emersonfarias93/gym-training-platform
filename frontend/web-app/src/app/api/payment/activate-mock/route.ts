import { NextResponse } from "next/server";

import { MOCK_PREMIUM_COOKIE, hasActivePlan, isMockCheckoutEnabled } from "@/lib/auth";
import { getServerAuthSession } from "@/services/auth/server";

// MOCK: ativacao simulada do plano premium (ambiente de testes).
// Em producao, a ativacao deve vir da confirmacao real do pagamento
// (webhook Confrapix -> user-service -> premiumActive=true), nao desta rota.
export async function POST() {
  if (!isMockCheckoutEnabled()) {
    return NextResponse.json(
      { message: "A ativacao simulada esta desabilitada." },
      { status: 404 }
    );
  }

  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json(
      { message: "Sessao expirada. Entre novamente para ativar o plano." },
      { status: 401 }
    );
  }

  if (hasActivePlan(session.user)) {
    return NextResponse.json({ ok: true });
  }

  const response = NextResponse.json({ ok: true });
  const expires = new Date(session.user.expiresAt);

  response.cookies.set(MOCK_PREMIUM_COOKIE, "1", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    ...(Number.isNaN(expires.getTime()) ? {} : { expires })
  });

  return response;
}
