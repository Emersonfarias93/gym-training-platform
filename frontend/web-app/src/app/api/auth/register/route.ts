import { NextResponse } from "next/server";

import {
  applyAuthCookies,
  getAuthApiErrorMessage,
  getAuthApiErrorStatus,
  registerWithAuthService
} from "@/services/auth/server";
import type { RegisterInput } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as RegisterInput;
    const authResponse = await registerWithAuthService(payload);
    const user = {
      userId: authResponse.userId,
      fullName: authResponse.fullName,
      email: authResponse.email,
      role: authResponse.role,
      expiresAt: authResponse.expiresAt
    };
    const response = NextResponse.json({
      authenticated: true,
      user
    }, {
      status: 201
    });

    applyAuthCookies(response, authResponse);

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: getAuthApiErrorMessage(error) },
      { status: getAuthApiErrorStatus(error, 400) }
    );
  }
}
