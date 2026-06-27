import "server-only";

import type { AuthUser } from "@/types/auth";
import type {
  CreateManualWorkoutInput,
  GenerateWorkoutInput,
  UpdateWorkoutInput,
  WorkoutOverviewResponse,
  WorkoutPlanDetail,
  WorkoutPlanSummary
} from "@/types/workout";

const DEFAULT_WORKOUT_SERVICE_URL = "http://localhost:8085";

class WorkoutApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "WorkoutApiError";
    this.status = status;
  }
}

function getWorkoutServiceBaseUrl() {
  return (process.env.WORKOUT_SERVICE_URL ?? DEFAULT_WORKOUT_SERVICE_URL).replace(/\/$/, "");
}

function getWorkoutServiceEndpoint(path: string) {
  return new URL(path, `${getWorkoutServiceBaseUrl()}/`).toString();
}

function getUserHeaders(user: Pick<AuthUser, "userId" | "email" | "fullName">) {
  return {
    "Content-Type": "application/json",
    "X-User-Id": user.userId,
    "X-User-Email": user.email,
    "X-User-Full-Name": user.fullName
  };
}

async function parseWorkoutResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T | { message?: string };

  if (!response.ok) {
    throw new WorkoutApiError(
      (payload as { message?: string }).message ?? "Nao foi possivel consultar os treinos.",
      response.status
    );
  }

  return payload as T;
}

export async function getWorkoutOverview(user: Pick<AuthUser, "userId" | "email" | "fullName">) {
  const response = await fetch(getWorkoutServiceEndpoint("/api/v1/workouts/me/overview"), {
    method: "GET",
    cache: "no-store",
    headers: getUserHeaders(user)
  });

  return parseWorkoutResponse<WorkoutOverviewResponse>(response);
}

export async function generateWorkoutWithAi(
  user: Pick<AuthUser, "userId" | "email" | "fullName">,
  input: GenerateWorkoutInput = {}
) {
  const response = await fetch(getWorkoutServiceEndpoint("/api/v1/workouts/me/generate-with-ai"), {
    method: "POST",
    cache: "no-store",
    headers: getUserHeaders(user),
    body: JSON.stringify(input)
  });

  return parseWorkoutResponse<WorkoutOverviewResponse>(response);
}

export async function createManualWorkout(
  user: Pick<AuthUser, "userId" | "email" | "fullName">,
  input: CreateManualWorkoutInput
) {
  const response = await fetch(getWorkoutServiceEndpoint("/api/v1/workouts/me/manual"), {
    method: "POST",
    cache: "no-store",
    headers: getUserHeaders(user),
    body: JSON.stringify(input)
  });

  return parseWorkoutResponse<WorkoutOverviewResponse>(response);
}

export async function listWorkoutPlans(user: Pick<AuthUser, "userId" | "email" | "fullName">) {
  const response = await fetch(getWorkoutServiceEndpoint("/api/v1/workouts/me/plans"), {
    method: "GET",
    cache: "no-store",
    headers: getUserHeaders(user)
  });

  return parseWorkoutResponse<WorkoutPlanSummary[]>(response);
}

export async function getWorkoutPlan(
  user: Pick<AuthUser, "userId" | "email" | "fullName">,
  planId: string
) {
  const response = await fetch(
    getWorkoutServiceEndpoint(`/api/v1/workouts/me/plans/${encodeURIComponent(planId)}`),
    {
      method: "GET",
      cache: "no-store",
      headers: getUserHeaders(user)
    }
  );

  return parseWorkoutResponse<WorkoutPlanDetail>(response);
}

export async function updateWorkoutPlan(
  user: Pick<AuthUser, "userId" | "email" | "fullName">,
  planId: string,
  input: UpdateWorkoutInput
) {
  const response = await fetch(
    getWorkoutServiceEndpoint(`/api/v1/workouts/me/plans/${encodeURIComponent(planId)}`),
    {
      method: "PUT",
      cache: "no-store",
      headers: getUserHeaders(user),
      body: JSON.stringify(input)
    }
  );

  return parseWorkoutResponse<WorkoutPlanDetail>(response);
}

export async function deleteWorkoutPlan(
  user: Pick<AuthUser, "userId" | "email" | "fullName">,
  planId: string
) {
  const response = await fetch(
    getWorkoutServiceEndpoint(`/api/v1/workouts/me/plans/${encodeURIComponent(planId)}`),
    {
      method: "DELETE",
      cache: "no-store",
      headers: getUserHeaders(user)
    }
  );

  // 204 No Content: sem corpo para parsear; só validamos o status.
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { message?: string };
    throw new WorkoutApiError(payload.message ?? "Nao foi possivel excluir o treino.", response.status);
  }
}

export async function activateWorkoutPlan(
  user: Pick<AuthUser, "userId" | "email" | "fullName">,
  planId: string
) {
  const response = await fetch(
    getWorkoutServiceEndpoint(`/api/v1/workouts/me/plans/${encodeURIComponent(planId)}/activate`),
    {
      method: "POST",
      cache: "no-store",
      headers: getUserHeaders(user)
    }
  );

  return parseWorkoutResponse<WorkoutOverviewResponse>(response);
}

export function getWorkoutApiErrorMessage(error: unknown) {
  if (error instanceof WorkoutApiError) {
    return error.message;
  }

  return "Nao foi possivel falar com o servico de treinos agora.";
}

export function getWorkoutApiErrorStatus(error: unknown, fallbackStatus: number) {
  if (error instanceof WorkoutApiError) {
    return error.status;
  }

  return fallbackStatus;
}
