import "server-only";

import { normalizePlanStatus } from "@/lib/auth";
import type { AuthUser, UserPlanStatus } from "@/types/auth";
import type { UserAiCoachContextResponse, UserPremiumStatusResponse } from "@/types/user";

const DEFAULT_USER_SERVICE_URL = "http://localhost:8082";

class UserApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "UserApiError";
    this.status = status;
  }
}

function getUserServiceBaseUrl() {
  return (process.env.USER_SERVICE_URL ?? DEFAULT_USER_SERVICE_URL).replace(/\/$/, "");
}

function getUserServiceEndpoint(path: string) {
  return new URL(path, `${getUserServiceBaseUrl()}/`).toString();
}

function getUserHeaders(user: Pick<AuthUser, "userId" | "email" | "fullName">) {
  return {
    "Content-Type": "application/json",
    "X-User-Id": user.userId,
    "X-User-Email": user.email,
    "X-User-Full-Name": user.fullName
  };
}

async function parseUserResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T | { message?: string };

  if (!response.ok) {
    throw new UserApiError(
      (payload as { message?: string }).message ?? "Nao foi possivel consultar os dados do usuario.",
      response.status
    );
  }

  return payload as T;
}

async function userServiceRequest<T>(path: string, user: Pick<AuthUser, "userId" | "email" | "fullName">) {
  const response = await fetch(getUserServiceEndpoint(path), {
    method: "GET",
    cache: "no-store",
    headers: getUserHeaders(user)
  });

  return parseUserResponse<T>(response);
}

export function premiumActiveToPlanStatus(premiumActive: boolean): UserPlanStatus {
  return premiumActive ? "ACTIVE_PLAN" : "COMMON";
}

export async function getUserPremiumStatus(user: Pick<AuthUser, "userId" | "email" | "fullName">) {
  return userServiceRequest<UserPremiumStatusResponse>("/api/v1/users/me/premium-status", user);
}

export async function getUserAiCoachContext(user: Pick<AuthUser, "userId" | "email" | "fullName">) {
  return userServiceRequest<UserAiCoachContextResponse>("/api/v1/users/me/ai-coach-context", user);
}

export async function resolveUserPlanStatus(user: AuthUser): Promise<UserPlanStatus> {
  try {
    const premium = await getUserPremiumStatus(user);
    return premiumActiveToPlanStatus(premium.premiumActive);
  } catch {
    return normalizePlanStatus(user.planStatus);
  }
}
