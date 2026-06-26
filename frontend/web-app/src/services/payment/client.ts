import type {
  ActivateMockPremiumResponse,
  PixCheckoutResponse,
  PixStatusResponse
} from "@/types/payment";

type ApiErrorPayload = {
  message?: string;
};

async function parseClientResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const payload = (await response.json()) as T | ApiErrorPayload;

  if (!response.ok) {
    throw new Error((payload as ApiErrorPayload).message ?? fallbackMessage);
  }

  return payload as T;
}

export async function createPixCheckout(): Promise<PixCheckoutResponse> {
  const response = await fetch("/api/payment/pix", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  return parseClientResponse<PixCheckoutResponse>(response, "Nao foi possivel gerar a cobranca Pix.");
}

export async function getPixStatus(transactionId: string): Promise<PixStatusResponse> {
  const response = await fetch(`/api/payment/pix/${encodeURIComponent(transactionId)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  return parseClientResponse<PixStatusResponse>(
    response,
    "Nao foi possivel consultar o status do pagamento."
  );
}

export async function activateMockPremium(): Promise<ActivateMockPremiumResponse> {
  const response = await fetch("/api/payment/activate-mock", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  return parseClientResponse<ActivateMockPremiumResponse>(
    response,
    "Nao foi possivel confirmar a ativacao do plano."
  );
}
