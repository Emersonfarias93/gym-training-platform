import type { AuthUser } from "@/types/auth";

export const AUTH_TOKEN_COOKIE = "fitai_access_token";
export const AUTH_PROFILE_COOKIE = "fitai_profile";

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

export function sanitizeAuthUser(user: AuthUser): AuthUser {
  return {
    userId: user.userId,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    expiresAt: user.expiresAt
  };
}
