import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  AUTH_PROFILE_COOKIE,
  AUTH_TOKEN_COOKIE,
  MOCK_PREMIUM_COOKIE,
  getAuthServiceEndpoint,
  isMockCheckoutEnabled,
  normalizePlanStatus,
  sanitizeAuthUser
} from "@/lib/auth";
import { findMockUserByToken } from "@/lib/mock-auth";
import { getUserPremiumStatus, premiumActiveToPlanStatus } from "@/services/user/server";
import type {
  AuthErrorResponse,
  AuthResponse,
  AuthUser,
  LoginInput,
  AuthServiceRegisterInput,
  RegisterInput,
  TokenValidationResponse
} from "@/types/auth";

class AuthApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

function getCookieExpiry(expiresAt: string) {
  const date = new Date(expiresAt);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function getCookieOptions(expiresAt?: string) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    ...(expiresAt ? { expires: getCookieExpiry(expiresAt) } : {})
  };
}

async function hasMockPremiumCookie(): Promise<boolean> {
  if (!isMockCheckoutEnabled()) {
    return false;
  }

  const cookieStore = await cookies();
  return cookieStore.get(MOCK_PREMIUM_COOKIE)?.value === "1";
}

async function enrichAuthUser(user: AuthUser): Promise<AuthUser> {
  // MOCK: ativacao simulada do plano. Substituir por integracao real de pagamento.
  if (await hasMockPremiumCookie()) {
    return sanitizeAuthUser({
      ...user,
      planStatus: "ACTIVE_PLAN",
      planName: "FitAI Premium",
      premiumStatus: "ACTIVE"
    });
  }

  try {
    const premium = await getUserPremiumStatus(user);

    return sanitizeAuthUser({
      ...user,
      planStatus: premiumActiveToPlanStatus(premium.premiumActive),
      planName: premium.planName,
      premiumStatus: premium.status,
      currentPeriodEnd: premium.currentPeriodEnd,
      lastSyncedAt: premium.lastSyncedAt
    });
  } catch {
    return sanitizeAuthUser(user);
  }
}

async function toAuthUser(response: AuthResponse): Promise<AuthUser> {
  return enrichAuthUser({
    userId: response.userId,
    fullName: response.fullName,
    email: response.email,
    cpfMasked: response.cpfMasked,
    planStatus: normalizePlanStatus(response.planStatus),
    planName: response.planName,
    premiumStatus: response.premiumStatus,
    currentPeriodEnd: response.currentPeriodEnd,
    lastSyncedAt: response.lastSyncedAt,
    expiresAt: response.expiresAt
  });
}

export async function createAuthUserFromResponse(response: AuthResponse) {
  return toAuthUser(response);
}

async function parseBackendResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T | AuthErrorResponse;

  if (!response.ok) {
    const error = payload as AuthErrorResponse;
    throw new AuthApiError(error.message || "Nao foi possivel concluir a autenticacao.", response.status);
  }

  return payload as T;
}

async function authServiceRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(getAuthServiceEndpoint(path), {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    }
  });

  return parseBackendResponse<T>(response);
}

function encodeProfile(user: AuthUser) {
  return encodeURIComponent(JSON.stringify(user));
}

function decodeProfile(rawValue?: string) {
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(rawValue)) as AuthUser;
  } catch {
    return null;
  }
}

export async function loginWithAuthService(payload: LoginInput) {
  return authServiceRequest<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function registerWithAuthService(payload: RegisterInput) {
  const backendPayload: AuthServiceRegisterInput = {
    ...payload,
    role: "USER"
  };

  return authServiceRequest<AuthResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(backendPayload)
  });
}

export async function validateAuthToken(token: string) {
  return authServiceRequest<TokenValidationResponse>("/api/v1/auth/validate", {
    method: "POST",
    body: JSON.stringify({ token })
  });
}

export function applyAuthCookies(response: NextResponse, authResponse: AuthResponse, user: AuthUser) {
  const sanitizedUser = sanitizeAuthUser(user);

  response.cookies.set(AUTH_TOKEN_COOKIE, authResponse.accessToken, getCookieOptions(authResponse.expiresAt));
  response.cookies.set(AUTH_PROFILE_COOKIE, encodeProfile(sanitizedUser), getCookieOptions(authResponse.expiresAt));

  return sanitizedUser;
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(AUTH_TOKEN_COOKIE, "", { ...getCookieOptions(), maxAge: 0 });
  response.cookies.set(AUTH_PROFILE_COOKIE, "", { ...getCookieOptions(), maxAge: 0 });
  // MOCK: limpa a ativacao simulada do plano ao encerrar a sessao.
  response.cookies.set(MOCK_PREMIUM_COOKIE, "", { ...getCookieOptions(), maxAge: 0 });
}

export const getServerAuthSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const mockUser = findMockUserByToken(token);
  if (mockUser) {
    // MOCK: aplica a ativacao simulada do plano tambem ao usuario comum mockado.
    if (mockUser.planStatus !== "ACTIVE_PLAN" && (await hasMockPremiumCookie())) {
      return {
        accessToken: token,
        user: sanitizeAuthUser({ ...mockUser, planStatus: "ACTIVE_PLAN" })
      };
    }

    return {
      accessToken: token,
      user: sanitizeAuthUser(mockUser)
    };
  }

  try {
    const validation = await validateAuthToken(token);

    if (!validation.valid || !validation.userId || !validation.email) {
      return null;
    }

    const profile = decodeProfile(cookieStore.get(AUTH_PROFILE_COOKIE)?.value);
    const fallbackName = validation.email.split("@")[0] ?? "FitAI";
    const fullName =
      profile && profile.userId === validation.userId && profile.email === validation.email
        ? profile.fullName
        : fallbackName;
    const expiresAt =
      profile && profile.userId === validation.userId && profile.email === validation.email
        ? profile.expiresAt
        : "";

    return {
      accessToken: token,
      user: await enrichAuthUser(sanitizeAuthUser({
        userId: validation.userId,
        fullName,
        email: validation.email,
        cpfMasked: profile?.cpfMasked,
        planStatus: normalizePlanStatus(profile?.planStatus ?? validation.planStatus),
        planName: profile?.planName,
        premiumStatus: profile?.premiumStatus,
        currentPeriodEnd: profile?.currentPeriodEnd,
        lastSyncedAt: profile?.lastSyncedAt,
        expiresAt
      }))
    };
  } catch {
    return null;
  }
});

export function getAuthApiErrorMessage(error: unknown) {
  if (error instanceof AuthApiError) {
    return error.message;
  }

  return "Nao foi possivel concluir a autenticacao agora.";
}

export function getAuthApiErrorStatus(error: unknown, fallbackStatus: number) {
  if (error instanceof AuthApiError) {
    return error.status;
  }

  return fallbackStatus;
}
