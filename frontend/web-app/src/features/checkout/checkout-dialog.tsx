"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  LoaderCircle,
  QrCode,
  RefreshCw
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { usePixCountdown } from "@/features/checkout/use-pix-countdown";
import { getSession } from "@/services/auth/client";
import { FITAI_PREMIUM_PLAN, formatBRL } from "@/lib/payment";
import { cn } from "@/lib/utils";
import { createPixCheckout, getPixStatus } from "@/services/payment/client";
import type { PixCheckoutResponse } from "@/types/payment";

type CheckoutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Step = "plan" | "pix";
type PixState = "waiting" | "paid" | "expired";

const POLL_INTERVAL_MS = 4000;
const SESSION_POLL_MS = 3000;
// Consulta a sessao ate o user-service refletir o acesso persistido no payment-service.

function PlanStep({
  isGenerating,
  errorMessage,
  onGenerate
}: {
  isGenerating: boolean;
  errorMessage: string | null;
  onGenerate: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-secondary)] p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl fitai-ai-gradient text-white">
              <Crown className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--fitai-text-primary)]">
                {FITAI_PREMIUM_PLAN.name}
              </p>
              <p className="text-xs text-[var(--fitai-text-muted)]">Pagamento unico via Pix</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-[var(--fitai-text-primary)]">
              {formatBRL(FITAI_PREMIUM_PLAN.priceBRL)}
            </p>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {FITAI_PREMIUM_PLAN.benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-2 text-sm text-[var(--fitai-text-secondary)]"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-[var(--fitai-success)]" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {errorMessage ? (
        <p className="flex items-center gap-2 rounded-xl border border-[var(--fitai-danger)]/40 bg-[var(--fitai-danger)]/10 px-3 py-2 text-sm text-[var(--fitai-danger)]">
          <AlertCircle className="size-4 shrink-0" />
          {errorMessage}
        </p>
      ) : null}

      <Button className="w-full" onClick={onGenerate} disabled={isGenerating}>
        {isGenerating ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Gerando Pix...
          </>
        ) : (
          <>
            <QrCode className="size-4" />
            Gerar Pix
          </>
        )}
      </Button>
    </div>
  );
}

function StatusBanner({ state }: { state: PixState | "activating" }) {
  if (state === "expired") {
    return (
      <p className="flex items-center gap-2 rounded-xl border border-[var(--fitai-danger)]/40 bg-[var(--fitai-danger)]/10 px-3 py-2.5 text-sm text-[var(--fitai-danger)]">
        <AlertCircle className="size-4 shrink-0" />
        Pix expirado. Gere um novo codigo para continuar.
      </p>
    );
  }

  if (state === "paid" || state === "activating") {
    return (
      <p className="flex items-center gap-2 rounded-xl border border-[var(--fitai-success)]/40 bg-[var(--fitai-success)]/10 px-3 py-2.5 text-sm text-[var(--fitai-success)]">
        <CheckCircle2 className="size-4 shrink-0" />
        Pagamento confirmado! Ativando seu plano...
      </p>
    );
  }

  return (
    <p className="flex items-center gap-2 rounded-xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-secondary)] px-3 py-2.5 text-sm text-[var(--fitai-text-secondary)]">
      <LoaderCircle className="size-4 shrink-0 animate-spin text-[var(--fitai-primary)]" />
      Aguardando pagamento...
    </p>
  );
}

function PixStep({
  checkout,
  state,
  countdownLabel,
  isWarning,
  isActivating,
  isChecking,
  errorMessage,
  onManualCheck,
  onRegenerate
}: {
  checkout: PixCheckoutResponse;
  state: PixState;
  countdownLabel: string;
  isWarning: boolean;
  isActivating: boolean;
  isChecking: boolean;
  errorMessage: string | null;
  onManualCheck: () => void;
  onRegenerate: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(checkout.copyPaste);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="overflow-hidden rounded-2xl border border-[var(--fitai-border)] bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={checkout.qrCodeImage}
            alt="QR Code Pix para pagamento do plano FitAI Premium"
            width={196}
            height={196}
            className={cn("size-44 transition-opacity", state === "expired" && "opacity-30")}
          />
        </div>
        <p className="text-sm text-[var(--fitai-text-secondary)]">
          Escaneie o QR Code no app do seu banco para pagar{" "}
          <span className="font-semibold text-[var(--fitai-text-primary)]">
            {formatBRL(checkout.amount)}
          </span>
        </p>
        {state === "waiting" ? (
          <p
            className={cn(
              "inline-flex items-center gap-1.5 text-xs",
              isWarning ? "text-[var(--fitai-warning)]" : "text-[var(--fitai-text-muted)]"
            )}
          >
            <Clock className="size-3.5" />
            Expira em{" "}
            <span className="font-mono font-semibold tabular-nums">{countdownLabel}</span>
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--fitai-text-muted)]">
          Pix copia e cola
        </p>
        <div className="flex items-stretch gap-2">
          <code className="min-w-0 flex-1 truncate rounded-xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] px-3 py-2.5 font-mono text-xs text-[var(--fitai-text-secondary)]">
            {checkout.copyPaste}
          </code>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            aria-label="Copiar codigo Pix"
            onClick={handleCopy}
            className={cn("shrink-0", copied && "text-[var(--fitai-success)]")}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copiado" : "Copiar"}
          </Button>
        </div>
      </div>

      <StatusBanner state={isActivating ? "activating" : state} />

      {errorMessage ? (
        <p className="flex items-center gap-2 rounded-xl border border-[var(--fitai-danger)]/40 bg-[var(--fitai-danger)]/10 px-3 py-2 text-sm text-[var(--fitai-danger)]">
          <AlertCircle className="size-4 shrink-0" />
          {errorMessage}
        </p>
      ) : null}

      {state === "expired" ? (
        <Button className="w-full" onClick={onRegenerate}>
          <QrCode className="size-4" />
          Gerar novo Pix
        </Button>
      ) : (
        <Button
          className="w-full"
          variant="secondary"
          onClick={onManualCheck}
          disabled={isChecking || isActivating || state === "paid"}
        >
          {isChecking ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          Verificar agora
        </Button>
      )}
    </div>
  );
}

export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("plan");
  const [checkout, setCheckout] = useState<PixCheckoutResponse | null>(null);
  const paidAtRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  const pixMutation = useMutation({
    mutationFn: createPixCheckout,
    onSuccess: (data) => {
      setCheckout(data);
      setStep("pix");
    }
  });

  const { label: countdownLabel, expired, isWarning } = usePixCountdown(checkout?.expiresAt);

  const finish = useCallback(() => {
    if (finishedRef.current) {
      return;
    }
    finishedRef.current = true;
    onOpenChange(false);
    router.refresh();
  }, [onOpenChange, router]);

  // 1) Polling do status do Pix na Confrapix (via payment-service).
  const statusQuery = useQuery({
    queryKey: ["pix-status", checkout?.numericId],
    queryFn: () => getPixStatus(checkout!.numericId),
    enabled: step === "pix" && !!checkout && !expired,
    refetchInterval: (query) => (query.state.data?.paid ? false : POLL_INTERVAL_MS),
    refetchOnWindowFocus: true
  });
  const paid = statusQuery.data?.paid ?? false;

  // 2) Apos confirmado, faz poll da sessao real ate o premium ativar (via Kafka).
  const sessionQuery = useQuery({
    queryKey: ["checkout-session"],
    queryFn: getSession,
    enabled: step === "pix" && !!checkout && !expired,
    refetchInterval: (query) =>
      query.state.data?.user?.planStatus === "ACTIVE_PLAN" ? false : SESSION_POLL_MS,
    refetchOnWindowFocus: false
  });
  const sessionActive = sessionQuery.data?.user?.planStatus === "ACTIVE_PLAN";

  // Marca o instante do pagamento confirmado.
  useEffect(() => {
    if (paid && paidAtRef.current === null) {
      paidAtRef.current = Date.now();
    }
  }, [paid]);

  // Conclui somente quando a sessao real vira premium via user-service/payment-service.
  useEffect(() => {
    if (!paid || finishedRef.current || !sessionActive) {
      return;
    }

    finish();
  }, [paid, sessionActive, finish]);

  // Reset ao fechar o modal.
  useEffect(() => {
    if (open) {
      return;
    }

    setStep("plan");
    setCheckout(null);
    paidAtRef.current = null;
    finishedRef.current = false;
    pixMutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const pixState: PixState = paid ? "paid" : expired ? "expired" : "waiting";
  const statusErrorMessage = statusQuery.isError ? (statusQuery.error as Error).message : null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Ativar plano FitAI Premium"
      description={
        step === "plan"
          ? "Conclua o pagamento via Pix para liberar o AI Coach."
          : "Pague com o QR Code — a confirmacao e automatica."
      }
    >
      {step === "plan" || !checkout ? (
        <PlanStep
          isGenerating={pixMutation.isPending}
          errorMessage={pixMutation.isError ? (pixMutation.error as Error).message : null}
          onGenerate={() => pixMutation.mutate()}
        />
      ) : (
        <PixStep
          checkout={checkout}
          state={pixState}
          countdownLabel={countdownLabel}
          isWarning={isWarning}
          isActivating={paid || sessionActive}
          isChecking={statusQuery.isFetching}
          errorMessage={statusErrorMessage}
          onManualCheck={() => statusQuery.refetch()}
          onRegenerate={() => {
            setCheckout(null);
            setStep("plan");
            paidAtRef.current = null;
            finishedRef.current = false;
            pixMutation.mutate();
          }}
        />
      )}
    </Dialog>
  );
}
