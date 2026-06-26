import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/services/auth/server";
import {
  generateWorkoutWithAi,
  getWorkoutApiErrorMessage,
  getWorkoutApiErrorStatus
} from "@/services/workout/server";
import type { GenerateWorkoutInput } from "@/types/workout";

export async function POST(request: Request) {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json(
      { message: "Sessao expirada. Entre novamente para gerar um treino." },
      { status: 401 }
    );
  }

  try {
    const payload = (await request.json().catch(() => ({}))) as GenerateWorkoutInput;
    const overview = await generateWorkoutWithAi(session.user, payload);
    return NextResponse.json(overview);
  } catch (error) {
    console.error("[workouts/generate] falha ao gerar treino:", error);

    return NextResponse.json(
      { message: getWorkoutApiErrorMessage(error) },
      { status: getWorkoutApiErrorStatus(error, 502) }
    );
  }
}
