export type UserRole = "USER" | "ADMIN" | "TRAINER";

export type AuthUser = {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
  expiresAt: string;
};

export type AuthResponse = {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
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
  role: UserRole;
};

export type TokenValidationResponse = {
  valid: boolean;
  userId: string | null;
  email: string | null;
  role: UserRole | null;
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
