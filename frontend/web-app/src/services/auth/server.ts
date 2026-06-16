import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  AUTH_PROFILE_COOKIE,
  AUTH_TOKEN_COOKIE,
  getAuthServiceEndpoint,
  sanitizeAuthUser
} from "@/lib/auth";
import type {
  AuthErrorResponse,
  AuthResponse,
  AuthUser,
  LoginInput,
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

function toAuthUser(response: AuthResponse): AuthUser {
  return sanitizeAuthUser({
    userId: response.userId,
    fullName: response.fullName,
    email: response.email,
    role: response.role,
    expiresAt: response.expiresAt
  });
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
  return authServiceRequest<AuthResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function validateAuthToken(token: string) {
  return authServiceRequest<TokenValidationResponse>("/api/v1/auth/validate", {
    method: "POST",
    body: JSON.stringify({ token })
  });
}

export function applyAuthCookies(response: NextResponse, authResponse: AuthResponse) {
  const user = toAuthUser(authResponse);

  response.cookies.set(AUTH_TOKEN_COOKIE, authResponse.accessToken, getCookieOptions(authResponse.expiresAt));
  response.cookies.set(AUTH_PROFILE_COOKIE, encodeProfile(user), getCookieOptions(authResponse.expiresAt));

  return user;
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(AUTH_TOKEN_COOKIE, "", { ...getCookieOptions(), maxAge: 0 });
  response.cookies.set(AUTH_PROFILE_COOKIE, "", { ...getCookieOptions(), maxAge: 0 });
}

export const getServerAuthSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const validation = await validateAuthToken(token);

    if (!validation.valid || !validation.userId || !validation.email || !validation.role) {
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
      user: sanitizeAuthUser({
        userId: validation.userId,
        fullName,
        email: validation.email,
        role: validation.role,
        expiresAt
      })
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
