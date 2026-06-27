import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/services/auth/server";
import {
  deleteWorkoutPlan,
  getWorkoutApiErrorMessage,
  getWorkoutApiErrorStatus,
  getWorkoutPlan,
  updateWorkoutPlan
} from "@/services/workout/server";
import type { UpdateWorkoutInput } from "@/types/workout";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json(
      { message: "Sessao expirada. Entre novamente para abrir o treino." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  try {
    const plan = await getWorkoutPlan(session.user, id);
    return NextResponse.json(plan);
  } catch (error) {
    console.error("[workouts/plans/:id] falha ao abrir treino:", error);

    return NextResponse.json(
      { message: getWorkoutApiErrorMessage(error) },
      { status: getWorkoutApiErrorStatus(error, 502) }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json(
      { message: "Sessao expirada. Entre novamente para salvar o treino." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  try {
    const payload = (await request.json().catch(() => ({}))) as UpdateWorkoutInput;
    const plan = await updateWorkoutPlan(session.user, id, payload);
    return NextResponse.json(plan);
  } catch (error) {
    console.error("[workouts/plans/:id] falha ao atualizar treino:", error);

    return NextResponse.json(
      { message: getWorkoutApiErrorMessage(error) },
      { status: getWorkoutApiErrorStatus(error, 502) }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json(
      { message: "Sessao expirada. Entre novamente para excluir o treino." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  try {
    await deleteWorkoutPlan(session.user, id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[workouts/plans/:id] falha ao excluir treino:", error);

    return NextResponse.json(
      { message: getWorkoutApiErrorMessage(error) },
      { status: getWorkoutApiErrorStatus(error, 502) }
    );
  }
}
