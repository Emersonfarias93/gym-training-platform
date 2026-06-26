export type Plan = {
  id: string;
  name: string;
  priceBRL: number;
  description: string;
  benefits: string[];
};

/**
 * Resposta normalizada que o frontend consome para exibir o Pix.
 * Derivada de `transaction` retornado pela Confrapix.
 */
export type PixCheckoutResponse = {
  transactionId: string;
  /** Data-URI pronta para `<img src>` (PNG base64). */
  qrCodeImage: string;
  /** Codigo Pix copia-e-cola (EMV). */
  copyPaste: string;
  amount: number;
  status: string;
  expiresAt: string;
};

/**
 * Forma parcial da resposta crua do provider (Confrapix) em
 * `POST /api/payments/pix/transactions`. Tipada apenas no que o front usa.
 */
export type PixProviderTransaction = {
  uuid?: string;
  amount?: number;
  status?: string;
  confirmed?: boolean;
  expired_in?: string;
  pix?: {
    url?: string;
    code?: string;
    txid?: string;
  };
};

export type PixProviderResponse = {
  success?: boolean;
  message?: string;
  transaction?: PixProviderTransaction;
};

export type PixCheckoutErrorResponse = {
  message: string;
};

export type ActivateMockPremiumResponse = {
  ok: boolean;
};
