import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/services/auth/server";
import {
  getWorkoutApiErrorMessage,
  getWorkoutApiErrorStatus,
  getWorkoutOverview
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
    const overview = await getWorkoutOverview(session.user);
    return NextResponse.json(overview);
  } catch (error) {
    console.error("[workouts/overview] falha ao consultar treinos:", error);

    return NextResponse.json(
      { message: getWorkoutApiErrorMessage(error) },
      { status: getWorkoutApiErrorStatus(error, 502) }
    );
  }
}
