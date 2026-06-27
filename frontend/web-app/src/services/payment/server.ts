import "server-only";

import type {
  PixCheckoutResponse,
  PixProviderResponse,
  PixStatusResponse
} from "@/types/payment";

const DEFAULT_PAYMENT_SERVICE_URL = "http://localhost:8083";

class PaymentApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PaymentApiError";
    this.status = status;
  }
}

function getPaymentServiceBaseUrl() {
  return (process.env.PAYMENT_SERVICE_URL ?? DEFAULT_PAYMENT_SERVICE_URL).replace(/\/$/, "");
}

function getPaymentServiceEndpoint(path: string) {
  return new URL(path, `${getPaymentServiceBaseUrl()}/`).toString();
}

type CreatePixInput = {
  amount: number;
};

/** Identidade enviada por header ao payment-service (não vai para a Confrapix). */
type PixRequester = {
  userId: string;
  email: string;
  fullName: string;
  planName: string;
};

function buildStorePixTransactionBody(input: CreatePixInput) {
  // Apenas `amount` e obrigatorio. A validade (`expiration_date`) e imposta pelo
  // payment-service (regra de negocio no backend), nao pelo cliente.
  // `customer_name`/`customer_document` sao opcionais e ficam de fora por enquanto.
  return {
    amount: input.amount,
    payment_type: "pix",
    type: "payment"
  };
}

function isPaidStatus(status?: string | null) {
  if (!status) {
    return false;
  }

  return ["succeeded", "paid", "confirmed", "approved", "completed"].includes(status.toLowerCase());
}

function normalizePixResponse(payload: PixProviderResponse): PixCheckoutResponse {
  const transaction = payload.transaction;

  if (!transaction?.pix?.url || !transaction.pix.code || !transaction.uuid || transaction.id == null) {
    throw new PaymentApiError("O provedor Pix retornou uma transacao incompleta.", 502);
  }

  return {
    transactionId: transaction.uuid,
    numericId: String(transaction.id),
    qrCodeImage: `data:image/png;base64,${transaction.pix.url}`,
    copyPaste: transaction.pix.code,
    amount: transaction.amount ?? 0,
    status: transaction.status ?? "processing",
    expiresAt: transaction.expired_in ?? ""
  };
}

function normalizePixStatus(payload: PixProviderResponse): PixStatusResponse {
  // No show/:id o status real esta em `transaction.status`; o `status` do topo e o
  // codigo HTTP (numero). So usamos o do topo como fallback se for string.
  const topStatus = typeof payload.status === "string" ? payload.status : undefined;
  const status = payload.transaction?.status ?? topStatus ?? "processing";
  const confirmed = payload.transaction?.confirmed ?? payload.confirmed ?? false;

  return {
    status,
    confirmed,
    paid: isPaidStatus(status) || confirmed === true
  };
}

async function parsePaymentResponse(response: Response): Promise<PixProviderResponse> {
  const payload = (await response.json()) as PixProviderResponse & { message?: string };

  if (!response.ok || payload.success === false) {
    throw new PaymentApiError(
      payload.message ?? "Nao foi possivel gerar a cobranca Pix agora.",
      response.ok ? 502 : response.status
    );
  }

  return payload;
}

export async function createPixTransaction(
  input: CreatePixInput,
  requester: PixRequester
): Promise<PixCheckoutResponse> {
  const response = await fetch(getPaymentServiceEndpoint("/api/payments/pix/transactions"), {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": requester.userId,
      "X-User-Email": requester.email,
      "X-User-Full-Name": requester.fullName,
      "X-Plan-Name": requester.planName
    },
    body: JSON.stringify(buildStorePixTransactionBody(input))
  });

  const payload = await parsePaymentResponse(response);
  return normalizePixResponse(payload);
}

export async function getPixTransactionStatus(transactionId: string): Promise<PixStatusResponse> {
  const response = await fetch(
    getPaymentServiceEndpoint(`/api/payments/pix/transactions/${encodeURIComponent(transactionId)}`),
    {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  const payload = await parsePaymentResponse(response);
  return normalizePixStatus(payload);
}

export function getPaymentApiErrorMessage(error: unknown) {
  if (error instanceof PaymentApiError) {
    return error.message;
  }

  return "Nao foi possivel falar com o servico de pagamento agora.";
}

export function getPaymentApiErrorStatus(error: unknown, fallbackStatus: number) {
  if (error instanceof PaymentApiError) {
    return error.status;
  }

  return fallbackStatus;
}
