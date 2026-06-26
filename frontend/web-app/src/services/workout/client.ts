import type {
  CreateManualWorkoutInput,
  GenerateWorkoutInput,
  WorkoutOverviewResponse
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
