import "server-only";

import type { LlmGenerateRequest, LlmGenerateResponse } from "@/types/ai-coach";

const DEFAULT_LLM_SERVICE_URL = "http://localhost:8087";

class LlmApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "LlmApiError";
    this.status = status;
  }
}

function getLlmServiceBaseUrl() {
  return (process.env.LLM_SERVICE_URL ?? DEFAULT_LLM_SERVICE_URL).replace(/\/$/, "");
}

function getLlmServiceEndpoint(path: string) {
  return new URL(path, `${getLlmServiceBaseUrl()}/`).toString();
}

async function parseLlmResponse(response: Response): Promise<LlmGenerateResponse> {
  const payload = (await response.json()) as Partial<LlmGenerateResponse> & { message?: string };

  if (!response.ok) {
    throw new LlmApiError(payload.message ?? "Nao foi possivel gerar uma resposta agora.", response.status);
  }

  if (!payload.generation) {
    throw new LlmApiError("O servico de IA retornou uma resposta vazia.", 502);
  }

  return {
    generation: payload.generation
  };
}

export async function generateWithLlmService(payload: LlmGenerateRequest) {
  const response = await fetch(getLlmServiceEndpoint("/api/llm/generate"), {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return parseLlmResponse(response);
}

export function getLlmApiErrorMessage(error: unknown) {
  if (error instanceof LlmApiError) {
    return error.message;
  }

  return "Nao foi possivel falar com o FitAI Coach agora.";
}

export function getLlmApiErrorStatus(error: unknown, fallbackStatus: number) {
  if (error instanceof LlmApiError) {
    return error.status;
  }

  return fallbackStatus;
}
