import { NextResponse } from "next/server";

import { createMockAuthResponse } from "@/lib/mock-auth";
import {
  applyAuthCookies,
  createAuthUserFromResponse,
  getAuthApiErrorStatus,
  loginWithAuthService
} from "@/services/auth/server";
import type { LoginInput } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LoginInput;
    const authResponse =
      createMockAuthResponse(payload) ?? (await loginWithAuthService(payload));
    const user = await createAuthUserFromResponse(authResponse);
    const response = NextResponse.json({
      authenticated: true,
      user
    });

    applyAuthCookies(response, authResponse, user);

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Login ou senha invalido." },
      { status: getAuthApiErrorStatus(error, 401) }
    );
  }
}
