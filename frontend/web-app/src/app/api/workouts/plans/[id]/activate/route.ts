import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/services/auth/server";
import {
  activateWorkoutPlan,
  getWorkoutApiErrorMessage,
  getWorkoutApiErrorStatus
} from "@/services/workout/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json(
      { message: "Sessao expirada. Entre novamente para escolher o treino." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  try {
    const overview = await activateWorkoutPlan(session.user, id);
    return NextResponse.json(overview);
  } catch (error) {
    console.error("[workouts/plans/:id/activate] falha ao escolher treino:", error);

    return NextResponse.json(
      { message: getWorkoutApiErrorMessage(error) },
      { status: getWorkoutApiErrorStatus(error, 502) }
    );
  }
}
