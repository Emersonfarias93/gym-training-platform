import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/services/auth/server";
import {
  getWorkoutApiErrorMessage,
  getWorkoutApiErrorStatus,
  listWorkoutPlans
} from "@/services/workout/server";

export async function GET() {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json(
      { message: "Sessao expirada. Entre novamente para ver seus treinos." },
      { status: 401 }
    );
  }

  try {
    const plans = await listWorkoutPlans(session.user);
    return NextResponse.json(plans);
  } catch (error) {
    console.error("[workouts/plans] falha ao listar treinos:", error);

    return NextResponse.json(
      { message: getWorkoutApiErrorMessage(error) },
      { status: getWorkoutApiErrorStatus(error, 502) }
    );
  }
}
