import { NextResponse } from "next/server";

import { createMockAuthResponse } from "@/lib/mock-auth";
import {
  applyAuthCookies,
  createAuthUserFromResponse,
  getAuthApiErrorStatus,
  loginWithAuthService
} from "@/services/auth/server";
import { loginSchema } from "@/features/auth/schema";

export async function POST(request: Request) {
  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ message: "Informe um e-mail e uma senha válidos." }, { status: 400 });
    }
    const payload = parsed.data;
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
