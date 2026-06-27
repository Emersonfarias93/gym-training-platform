import type {
  CreateManualWorkoutInput,
  GenerateWorkoutInput,
  UpdateWorkoutInput,
  WorkoutOverviewResponse,
  WorkoutPlanDetail,
  WorkoutPlanSummary
} from "@/types/workout";

type ApiErrorPayload = {
  message?: string;
};

async function parseClientResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const payload = (await response.json()) as T | ApiErrorPayload;

  if (!response.ok) {
    throw new Error((payload as ApiErrorPayload).message ?? fallbackMessage);
  }

  return payload as T;
}

export async function getWorkoutOverview(): Promise<WorkoutOverviewResponse> {
  const response = await fetch("/api/workouts/overview", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  return parseClientResponse<WorkoutOverviewResponse>(
    response,
    "Nao foi possivel carregar seus treinos."
  );
}

export async function generateWorkout(input: GenerateWorkoutInput = {}): Promise<WorkoutOverviewResponse> {
  const response = await fetch("/api/workouts/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  return parseClientResponse<WorkoutOverviewResponse>(
    response,
    "Nao foi possivel gerar um novo treino agora."
  );
}

export async function createManualWorkout(input: CreateManualWorkoutInput): Promise<WorkoutOverviewResponse> {
  const response = await fetch("/api/workouts/manual", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  return parseClientResponse<WorkoutOverviewResponse>(
    response,
    "Nao foi possivel salvar o treino manual agora."
  );
}

export async function listWorkoutPlans(): Promise<WorkoutPlanSummary[]> {
  const response = await fetch("/api/workouts/plans", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  return parseClientResponse<WorkoutPlanSummary[]>(response, "Nao foi possivel carregar seus treinos.");
}

export async function getWorkoutPlan(planId: string): Promise<WorkoutPlanDetail> {
  const response = await fetch(`/api/workouts/plans/${encodeURIComponent(planId)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  return parseClientResponse<WorkoutPlanDetail>(response, "Nao foi possivel abrir o treino.");
}

export async function updateWorkoutPlan(
  planId: string,
  input: UpdateWorkoutInput
): Promise<WorkoutPlanDetail> {
  const response = await fetch(`/api/workouts/plans/${encodeURIComponent(planId)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  return parseClientResponse<WorkoutPlanDetail>(response, "Nao foi possivel salvar as alteracoes do treino.");
}

export async function deleteWorkoutPlan(planId: string): Promise<void> {
  const response = await fetch(`/api/workouts/plans/${encodeURIComponent(planId)}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(payload.message ?? "Nao foi possivel excluir o treino.");
  }
}

export async function activateWorkoutPlan(planId: string): Promise<WorkoutOverviewResponse> {
  const response = await fetch(`/api/workouts/plans/${encodeURIComponent(planId)}/activate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  return parseClientResponse<WorkoutOverviewResponse>(response, "Nao foi possivel escolher este treino.");
}
