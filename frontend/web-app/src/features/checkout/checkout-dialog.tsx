"use client";

import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Crown,
  LoaderCircle,
  QrCode
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FITAI_PREMIUM_PLAN, formatBRL } from "@/lib/payment";
import { cn } from "@/lib/utils";
import { activateMockPremium, createPixCheckout } from "@/services/payment/client";
import type { PixCheckoutResponse } from "@/types/payment";

type CheckoutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Step = "plan" | "pix";

function formatExpiry(value: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(parsed);
}

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

function PixStep({
  checkout,
  isActivating,
  errorMessage,
  onConfirm
}: {
  checkout: PixCheckoutResponse;
  isActivating: boolean;
  errorMessage: string | null;
  onConfirm: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const expiry = formatExpiry(checkout.expiresAt);

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
            className="size-44"
          />
        </div>
        <p className="text-sm text-[var(--fitai-text-secondary)]">
          Escaneie o QR Code no app do seu banco para pagar{" "}
          <span className="font-semibold text-[var(--fitai-text-primary)]">
            {formatBRL(checkout.amount)}
          </span>
        </p>
        {expiry ? (
          <p className="text-xs text-[var(--fitai-text-muted)]">Valido ate {expiry}</p>
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

      {errorMessage ? (
        <p className="flex items-center gap-2 rounded-xl border border-[var(--fitai-danger)]/40 bg-[var(--fitai-danger)]/10 px-3 py-2 text-sm text-[var(--fitai-danger)]">
          <AlertCircle className="size-4 shrink-0" />
          {errorMessage}
        </p>
      ) : null}

      <Button className="w-full" onClick={onConfirm} disabled={isActivating}>
        {isActivating ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Confirmando...
          </>
        ) : (
          <>
            <CheckCircle2 className="size-4" />
            Ja paguei
          </>
        )}
      </Button>
    </div>
  );
}

export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("plan");
  const [checkout, setCheckout] = useState<PixCheckoutResponse | null>(null);

  const pixMutation = useMutation({
    mutationFn: createPixCheckout,
    onSuccess: (data) => {
      setCheckout(data);
      setStep("pix");
    }
  });

  const activateMutation = useMutation({
    mutationFn: activateMockPremium,
    onSuccess: () => {
      onOpenChange(false);
      router.refresh();
    }
  });

  useEffect(() => {
    if (open) {
      return;
    }

    // Reseta o fluxo ao fechar o modal.
    setStep("plan");
    setCheckout(null);
    pixMutation.reset();
    activateMutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Ativar plano FitAI Premium"
      description={
        step === "plan"
          ? "Conclua o pagamento via Pix para liberar o AI Coach."
          : "Pague com o QR Code e confirme para ativar seu plano."
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
          isActivating={activateMutation.isPending}
          errorMessage={activateMutation.isError ? (activateMutation.error as Error).message : null}
          onConfirm={() => activateMutation.mutate()}
        />
      )}
    </Dialog>
  );
}
