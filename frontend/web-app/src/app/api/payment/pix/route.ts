import { NextResponse } from "next/server";

import { hasActivePlan } from "@/lib/auth";
import { FITAI_PREMIUM_PLAN } from "@/lib/payment";
import { getServerAuthSession } from "@/services/auth/server";
import { createPixTransaction, getPaymentApiErrorStatus } from "@/services/payment/server";

export async function POST() {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json(
      { message: "Sessao expirada. Entre novamente para ativar o plano." },
      { status: 401 }
    );
  }

  if (hasActivePlan(session.user)) {
    return NextResponse.json(
      { message: "Voce ja possui um plano ativo." },
      { status: 400 }
    );
  }

  try {
    const checkout = await createPixTransaction({
      amount: FITAI_PREMIUM_PLAN.priceBRL
    });

    return NextResponse.json(checkout);
  } catch (error) {
    // Loga o erro real (ex: 409 da Confrapix) sem expor detalhes ao usuario.
    console.error("[payment/pix] falha ao gerar cobranca Pix:", error);

    return NextResponse.json(
      { message: "Falha ao gerar QR Code." },
      { status: getPaymentApiErrorStatus(error, 502) }
    );
  }
}
