import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/services/auth/server";
import {
  createManualWorkout,
  getWorkoutApiErrorMessage,
  getWorkoutApiErrorStatus
} from "@/services/workout/server";
import type { CreateManualWorkoutInput } from "@/types/workout";

export async function POST(request: Request) {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json(
      { message: "Sessao expirada. Entre novamente para salvar seu treino." },
      { status: 401 }
    );
  }

  try {
    const payload = (await request.json().catch(() => ({}))) as CreateManualWorkoutInput;
    const overview = await createManualWorkout(session.user, payload);
    return NextResponse.json(overview);
  } catch (error) {
    console.error("[workouts/manual] falha ao salvar treino:", error);

    return NextResponse.json(
      { message: getWorkoutApiErrorMessage(error) },
      { status: getWorkoutApiErrorStatus(error, 502) }
    );
  }
}
