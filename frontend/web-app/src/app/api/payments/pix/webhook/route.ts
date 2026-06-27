import { NextResponse } from "next/server";

const DEFAULT_PAYMENT_SERVICE_URL = "http://localhost:8083";

function getPaymentServiceBaseUrl() {
  return (process.env.PAYMENT_SERVICE_URL ?? DEFAULT_PAYMENT_SERVICE_URL).replace(/\/$/, "");
}

function getPaymentWebhookEndpoint(token: string | null) {
  const endpoint = new URL("/api/payments/pix/webhook", `${getPaymentServiceBaseUrl()}/`);

  if (token) {
    endpoint.searchParams.set("token", token);
  }

  return endpoint.toString();
}

export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const payload = await request.text();

  const response = await fetch(getPaymentWebhookEndpoint(token), {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": request.headers.get("content-type") ?? "application/json"
    },
    body: payload
  });

  if (!response.ok) {
    console.error("[payments/pix/webhook] falha ao encaminhar callback:", {
      status: response.status,
      tokenPresent: Boolean(token)
    });
  }

  return new NextResponse(null, { status: response.status });
}
