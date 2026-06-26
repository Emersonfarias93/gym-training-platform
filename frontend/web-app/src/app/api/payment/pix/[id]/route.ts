import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/services/auth/server";
import { getPaymentApiErrorStatus, getPixTransactionStatus } from "@/services/payment/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json(
      { message: "Sessao expirada. Entre novamente para continuar." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  try {
    const status = await getPixTransactionStatus(id);
    return NextResponse.json(status);
  } catch (error) {
    // Loga o erro real sem expor detalhes ao usuario.
    console.error("[payment/pix/status] falha ao consultar status do Pix:", error);

    return NextResponse.json(
      { message: "Nao foi possivel consultar o status do pagamento." },
      { status: getPaymentApiErrorStatus(error, 502) }
    );
  }
}
