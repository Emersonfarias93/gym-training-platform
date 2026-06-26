import type { UserPremiumStatus } from "@/types/user";

export type UserPlanStatus = "COMMON" | "ACTIVE_PLAN";
export type BackendAuthRole = "USER" | "ADMIN" | "TRAINER";

export type AuthUser = {
  userId: string;
  fullName: string;
  email: string;
  cpfMasked?: string | null;
  planStatus: UserPlanStatus;
  planName?: string | null;
  premiumStatus?: UserPremiumStatus;
  currentPeriodEnd?: string | null;
  lastSyncedAt?: string | null;
  expiresAt: string;
};

export type AuthResponse = {
  userId: string;
  fullName: string;
  email: string;
  cpfMasked?: string | null;
  planStatus?: UserPlanStatus | null;
  planName?: string | null;
  premiumStatus?: UserPremiumStatus;
  currentPeriodEnd?: string | null;
  lastSyncedAt?: string | null;
  role?: BackendAuthRole;
  accessToken: string;
  tokenType: string;
  expiresAt: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
};

export type AuthServiceRegisterInput = RegisterInput & {
  role: "USER";
};

export type TokenValidationResponse = {
  valid: boolean;
  userId: string | null;
  email: string | null;
  planStatus?: UserPlanStatus | null;
  role?: BackendAuthRole | null;
};

export type AuthErrorResponse = {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
};

export type SessionResponse = {
  authenticated: boolean;
  user: AuthUser | null;
};
