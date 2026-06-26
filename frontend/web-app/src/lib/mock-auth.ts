import type { AuthResponse, AuthUser, LoginInput } from "@/types/auth";
import { getMonthlyPlanPeriodEndIso } from "@/lib/auth";

export const MOCK_AUTH_CREDENTIALS = {
  email: "demo@fitai.com",
  password: "fitai1234"
} as const;

export const MOCK_COMMON_CREDENTIALS = {
  email: "comum@fitai.com",
  password: "fitai1234"
} as const;

export const MOCK_AUTH_TOKEN = "fitai-mock-session-token";
export const MOCK_COMMON_TOKEN = "fitai-mock-session-token-common";

const mockExpiresAt = "2099-12-31T23:59:59.000Z";
const mockLastSyncedAt = new Date().toISOString();

// Usuario mockado com plano ativo (AI Coach liberado).
export const mockAuthUser: AuthUser = {
  userId: "00000000-0000-4000-8000-000000000001",
  fullName: "Usuario Demo",
  email: MOCK_AUTH_CREDENTIALS.email,
  cpfMasked: "***.***.***-09",
  planStatus: "ACTIVE_PLAN",
  planName: "FitAI Premium",
  premiumStatus: "ACTIVE",
  currentPeriodEnd: getMonthlyPlanPeriodEndIso(),
  lastSyncedAt: mockLastSyncedAt,
  expiresAt: mockExpiresAt
};

// Usuario mockado comum (sem plano) - util para testar o checkout/upgrade.
export const mockCommonUser: AuthUser = {
  userId: "00000000-0000-4000-8000-000000000002",
  fullName: "Usuario Comum",
  email: MOCK_COMMON_CREDENTIALS.email,
  cpfMasked: "***.***.***-42",
  planStatus: "COMMON",
  planName: null,
  premiumStatus: "NONE",
  currentPeriodEnd: null,
  lastSyncedAt: mockLastSyncedAt,
  expiresAt: mockExpiresAt
};

type MockAccount = {
  credentials: { email: string; password: string };
  token: string;
  user: AuthUser;
};

const MOCK_ACCOUNTS: MockAccount[] = [
  { credentials: MOCK_AUTH_CREDENTIALS, token: MOCK_AUTH_TOKEN, user: mockAuthUser },
  { credentials: MOCK_COMMON_CREDENTIALS, token: MOCK_COMMON_TOKEN, user: mockCommonUser }
];

function findMockAccountByLogin(payload: LoginInput): MockAccount | null {
  const email = payload.email.trim().toLowerCase();

  return (
    MOCK_ACCOUNTS.find(
      (account) =>
        account.credentials.email === email && account.credentials.password === payload.password
    ) ?? null
  );
}

export function findMockUserByToken(token: string): AuthUser | null {
  return MOCK_ACCOUNTS.find((account) => account.token === token)?.user ?? null;
}

export function isMockLogin(payload: LoginInput): boolean {
  return findMockAccountByLogin(payload) !== null;
}

export function createMockAuthResponse(payload: LoginInput): AuthResponse | null {
  const account = findMockAccountByLogin(payload);

  if (!account) {
    return null;
  }

  return {
    ...account.user,
    planStatus: account.user.planStatus,
    accessToken: account.token,
    tokenType: "Bearer"
  };
}
