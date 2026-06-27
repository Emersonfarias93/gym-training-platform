import { NextResponse } from "next/server";

import { hasActivePlan } from "@/lib/auth";
import { getServerAuthSession } from "@/services/auth/server";
import {
  createManualWorkout,
  getWorkoutApiErrorMessage,
  getWorkoutApiErrorStatus,
  listWorkoutPlans
} from "@/services/workout/server";
import type { CreateManualWorkoutInput } from "@/types/workout";

const FREE_WORKOUT_LIMIT = 2;

export async function POST(request: Request) {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json(
      { message: "Sessao expirada. Entre novamente para salvar seu treino." },
      { status: 401 }
    );
  }

  try {
    if (!hasActivePlan(session.user)) {
      const plans = await listWorkoutPlans(session.user);

      if (plans.length >= FREE_WORKOUT_LIMIT) {
        return NextResponse.json(
          { message: "O plano Free permite criar ate 2 treinos. Ative o plano para criar mais." },
          { status: 403 }
        );
      }
    }

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
