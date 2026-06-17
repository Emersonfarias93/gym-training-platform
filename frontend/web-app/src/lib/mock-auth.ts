import type { AuthResponse, AuthUser, LoginInput } from "@/types/auth";

export const MOCK_AUTH_CREDENTIALS = {
  email: "demo@fitai.com",
  password: "fitai1234"
} as const;

export const MOCK_AUTH_TOKEN = "fitai-mock-session-token";

const mockExpiresAt = "2099-12-31T23:59:59.000Z";

export const mockAuthUser: AuthUser = {
  userId: "00000000-0000-4000-8000-000000000001",
  fullName: "Usuario Demo",
  email: MOCK_AUTH_CREDENTIALS.email,
  role: "USER",
  expiresAt: mockExpiresAt
};

export function isMockLogin(payload: LoginInput) {
  return (
    payload.email.trim().toLowerCase() === MOCK_AUTH_CREDENTIALS.email &&
    payload.password === MOCK_AUTH_CREDENTIALS.password
  );
}

export function createMockAuthResponse(): AuthResponse {
  return {
    ...mockAuthUser,
    accessToken: MOCK_AUTH_TOKEN,
    tokenType: "Bearer"
  };
}
