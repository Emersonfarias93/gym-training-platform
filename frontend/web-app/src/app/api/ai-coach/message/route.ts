import { NextResponse } from "next/server";

import { buildAiCoachPrompt, createAiCoachMessage } from "@/lib/ai-coach";
import { getServerAuthSession } from "@/services/auth/server";
import {
  generateWithLlmService,
  getLlmApiErrorMessage,
  getLlmApiErrorStatus
} from "@/services/llm/server";
import { getUserAiCoachContext, resolveUserPlanStatus } from "@/services/user/server";
import type { AiCoachRequest } from "@/types/ai-coach";

export async function POST(request: Request) {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json({ message: "Sessao expirada. Entre novamente para usar o FitAI Coach." }, { status: 401 });
  }

  if ((await resolveUserPlanStatus(session.user)) !== "ACTIVE_PLAN") {
    return NextResponse.json(
      { message: "O FitAI Coach esta disponivel apenas para usuarios com plano ativo." },
      { status: 403 }
    );
  }

  try {
    const payload = (await request.json()) as AiCoachRequest;
    const message = payload.message.trim();

    if (!message) {
      return NextResponse.json({ message: "Digite uma mensagem para o FitAI Coach." }, { status: 400 });
    }

    const userContext = await getUserAiCoachContext(session.user).catch(() => null);
    const prompt = buildAiCoachPrompt({
      history: payload.history,
      message,
      user: session.user,
      userContext
    });
    const response = await generateWithLlmService({ prompt });

    return NextResponse.json({
      message: createAiCoachMessage("ai", response.generation)
    });
  } catch (error) {
    return NextResponse.json(
      { message: getLlmApiErrorMessage(error) },
      { status: getLlmApiErrorStatus(error, 502) }
    );
  }
}
