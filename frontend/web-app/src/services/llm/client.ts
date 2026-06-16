import type { AiCoachRequest, AiCoachResponse } from "@/types/ai-coach";

type ApiErrorPayload = {
  message?: string;
};

async function parseClientResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T | ApiErrorPayload;

  if (!response.ok) {
    throw new Error((payload as ApiErrorPayload).message ?? "Falha ao gerar resposta do FitAI Coach.");
  }

  return payload as T;
}

export async function sendAiCoachMessage(payload: AiCoachRequest) {
  const response = await fetch("/api/ai-coach/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return parseClientResponse<AiCoachResponse>(response);
}
