import { NextResponse } from "next/server";

import {
  applyAuthCookies,
  createAuthUserFromResponse,
  getAuthApiErrorMessage,
  getAuthApiErrorStatus,
  registerWithAuthService
} from "@/services/auth/server";
import { registerSchema } from "@/features/auth/schema";

export async function POST(request: Request) {
  try {
    const parsed = registerSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
    }
    const payload = parsed.data;
    const authResponse = await registerWithAuthService(payload);
    const user = await createAuthUserFromResponse(authResponse);
    const response = NextResponse.json({
      authenticated: true,
      user
    }, {
      status: 201
    });

    applyAuthCookies(response, authResponse, user);

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: getAuthApiErrorMessage(error) },
      { status: getAuthApiErrorStatus(error, 400) }
    );
  }
}
