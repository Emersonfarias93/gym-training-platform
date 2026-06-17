import type { LoginInput, RegisterInput, SessionResponse } from "@/types/auth";

type ApiErrorPayload = {
  message?: string;
};

async function parseClientResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T | ApiErrorPayload;

  if (!response.ok) {
    throw new Error((payload as ApiErrorPayload).message ?? "Falha ao processar a autenticacao.");
  }

  return payload as T;
}

async function authRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  return parseClientResponse<T>(response);
}

export function login(payload: LoginInput) {
  return authRequest<SessionResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function register(payload: RegisterInput) {
  return authRequest<SessionResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function logout() {
  return authRequest<{ success: true }>("/api/auth/logout", {
    method: "POST"
  });
}

export function getSession() {
  return authRequest<SessionResponse>("/api/auth/session", {
    method: "GET",
    cache: "no-store"
  });
}
