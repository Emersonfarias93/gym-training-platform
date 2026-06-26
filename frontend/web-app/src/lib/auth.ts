import type { AuthUser, UserPlanStatus } from "@/types/auth";

export const AUTH_TOKEN_COOKIE = "fitai_access_token";
export const AUTH_PROFILE_COOKIE = "fitai_profile";
// MOCK: cookie de ativacao simulada do plano premium (ambiente de testes).
// Quando presente, a sessao trata o usuario como ACTIVE_PLAN sem consultar o
// user-service. Ponto de plugagem para a integracao real (webhook -> ativacao).
export const MOCK_PREMIUM_COOKIE = "fitai_mock_premium";

export function isMockCheckoutEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_MOCK_CHECKOUT !== "false";
}

const DEFAULT_AUTH_SERVICE_URL = "http://localhost:8081";

export function getAuthServiceBaseUrl() {
  return (process.env.AUTH_SERVICE_URL ?? DEFAULT_AUTH_SERVICE_URL).replace(/\/$/, "");
}

export function getAuthServiceEndpoint(path: string) {
  return new URL(path, `${getAuthServiceBaseUrl()}/`).toString();
}

export function getUserInitials(fullName: string) {
  const initials = fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "FA";
}

export function normalizePlanStatus(planStatus?: string | null): UserPlanStatus {
  return planStatus === "ACTIVE_PLAN" ? "ACTIVE_PLAN" : "COMMON";
}

export function hasActivePlan(user: AuthUser) {
  return user.planStatus === "ACTIVE_PLAN";
}

export function getPlanLabel(user: AuthUser) {
  return hasActivePlan(user) ? "Plano ativo" : "Plano comum";
}

export function getMonthlyPlanPeriodEndIso(from = new Date()) {
  const periodEnd = new Date(from);
  periodEnd.setMonth(periodEnd.getMonth() + 1);
  return periodEnd.toISOString();
}

export function sanitizeAuthUser(user: AuthUser): AuthUser {
  const planStatus = normalizePlanStatus(user.planStatus);
  const isActivePlan = planStatus === "ACTIVE_PLAN";

  return {
    userId: user.userId,
    fullName: user.fullName,
    email: user.email,
    cpfMasked: user.cpfMasked ?? null,
    planStatus,
    planName: user.planName ?? (isActivePlan ? "FitAI Premium" : null),
    premiumStatus: user.premiumStatus ?? (isActivePlan ? "ACTIVE" : "NONE"),
    currentPeriodEnd: user.currentPeriodEnd ?? (isActivePlan ? getMonthlyPlanPeriodEndIso() : null),
    lastSyncedAt: user.lastSyncedAt ?? null,
    expiresAt: user.expiresAt
  };
}
