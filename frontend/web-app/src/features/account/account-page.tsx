import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  CreditCard,
  FileText,
  IdCard,
  LockKeyhole,
  Mail,
  ReceiptText,
  UserRound
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { UpgradePlanButton } from "@/features/checkout/upgrade-plan-button";
import { FITAI_PREMIUM_PLAN, formatBRL } from "@/lib/payment";
import { cn } from "@/lib/utils";
import { hasActivePlan } from "@/lib/auth";
import type { AuthUser } from "@/types/auth";

type AccountPageProps = {
  user: AuthUser;
};

type PremiumStatus = NonNullable<AuthUser["premiumStatus"]>;

type PaymentHistoryItem = {
  id: string;
  title: string;
  description: string;
  amount: string;
  date: Date | null;
  status: "Pago" | "Previsto";
};

const DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric"
});

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
});

const STATUS_META: Record<PremiumStatus, { label: string; className: string }> = {
  NONE: {
    label: "Sem assinatura",
    className: "border-[var(--fitai-border)] bg-[var(--fitai-surface-secondary)] text-[var(--fitai-text-secondary)]"
  },
  ACTIVE: {
    label: "Ativo",
    className: "border-[rgba(0,208,132,0.24)] bg-[rgba(0,208,132,0.10)] text-[var(--fitai-success)]"
  },
  TRIALING: {
    label: "Em teste",
    className: "border-[rgba(79,124,255,0.24)] bg-[rgba(79,124,255,0.10)] text-[var(--fitai-primary)]"
  },
  PAST_DUE: {
    label: "Pagamento pendente",
    className: "border-[rgba(255,159,67,0.28)] bg-[rgba(255,159,67,0.10)] text-[var(--fitai-warning)]"
  },
  CANCELED: {
    label: "Cancelado",
    className: "border-[var(--fitai-border)] bg-[var(--fitai-surface-secondary)] text-[var(--fitai-text-secondary)]"
  },
  EXPIRED: {
    label: "Expirado",
    className: "border-[rgba(255,107,107,0.28)] bg-[rgba(255,107,107,0.10)] text-[var(--fitai-danger)]"
  }
};

function parseDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(date: Date | null) {
  return date ? DATE_FORMATTER.format(date) : "Nao informado";
}

function formatShortDate(date: Date | null) {
  return date ? SHORT_DATE_FORMATTER.format(date) : "Pendente";
}

function getMonthlyPeriodStart(periodEnd: Date | null) {
  if (!periodEnd) {
    return null;
  }

  const periodStart = new Date(periodEnd);
  periodStart.setMonth(periodStart.getMonth() - 1);
  return periodStart;
}

function getPaymentHistory(user: AuthUser, periodEnd: Date | null): PaymentHistoryItem[] {
  if (!hasActivePlan(user)) {
    return [];
  }

  const periodStart = getMonthlyPeriodStart(periodEnd);

  return [
    {
      id: "active-period",
      title: "Plano FitAI Premium",
      description: "Pagamento mensal confirmado para o periodo atual.",
      amount: formatBRL(FITAI_PREMIUM_PLAN.priceBRL),
      date: periodStart,
      status: "Pago"
    },
    {
      id: "next-renewal",
      title: "Renovacao mensal",
      description: "Proxima cobranca prevista para manter o AI Coach ativo.",
      amount: formatBRL(FITAI_PREMIUM_PLAN.priceBRL),
      date: periodEnd,
      status: "Previsto"
    }
  ];
}

export function AccountPage({ user }: AccountPageProps) {
  const activePlan = hasActivePlan(user);
  const premiumStatus = user.premiumStatus ?? (activePlan ? "ACTIVE" : "NONE");
  const statusMeta = STATUS_META[premiumStatus] ?? STATUS_META.NONE;
  const planName = activePlan ? user.planName ?? FITAI_PREMIUM_PLAN.name : "Plano Free";
  const periodEnd = parseDate(user.currentPeriodEnd);
  const periodStart = getMonthlyPeriodStart(periodEnd);
  const paymentHistory = getPaymentHistory(user, periodEnd);
  const identityItems = [
    {
      label: "Nome",
      value: user.fullName,
      helper: "Identificacao principal da conta.",
      icon: UserRound
    },
    {
      label: "Email",
      value: user.email,
      helper: "Usado para acesso e comunicacoes essenciais.",
      icon: Mail
    },
    {
      label: "CPF",
      value: user.cpfMasked ?? "Nao informado",
      helper: user.cpfMasked
        ? "Exibicao mascarada para reduzir exposicao de dado pessoal."
        : "Ainda nao recebemos um CPF mascarado do servico de usuario.",
      icon: IdCard
    }
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-[var(--fitai-border)] bg-[linear-gradient(135deg,rgba(79,124,255,0.14),rgba(0,208,132,0.07))] p-5 shadow-[0_18px_60px_-44px_rgba(0,0,0,0.9)] md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <Badge className={statusMeta.className}>{statusMeta.label}</Badge>
              <h2 className="mt-4 text-2xl font-semibold tracking-normal text-[var(--fitai-text-primary)]">
                {planName}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--fitai-text-secondary)]">
                {activePlan
                  ? "Sua assinatura mensal esta ativa e libera o AI Coach, recomendacoes inteligentes e experiencias avancadas."
                  : "Sua conta esta no plano Free. Ative a assinatura mensal para liberar a experiencia completa com AI Coach."}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-[var(--fitai-border)] bg-[rgba(10,12,16,0.32)] px-4 py-3">
              <CalendarClock className="size-5 text-[var(--fitai-primary)]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--fitai-text-muted)]">
                  Expira em
                </p>
                <p className="text-sm font-semibold text-[var(--fitai-text-primary)]">
                  {activePlan ? formatDate(periodEnd) : "Sem plano ativo"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--fitai-border)] bg-[rgba(10,12,16,0.26)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--fitai-text-muted)]">
                Ciclo
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--fitai-text-primary)]">Mensal</p>
            </div>
            <div className="rounded-2xl border border-[var(--fitai-border)] bg-[rgba(10,12,16,0.26)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--fitai-text-muted)]">
                Periodo atual
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--fitai-text-primary)]">
                {activePlan ? `${formatShortDate(periodStart)} - ${formatShortDate(periodEnd)}` : "Nao iniciado"}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--fitai-border)] bg-[rgba(10,12,16,0.26)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--fitai-text-muted)]">
                Valor
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--fitai-text-primary)]">
                {formatBRL(FITAI_PREMIUM_PLAN.priceBRL)} / mes
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {activePlan ? (
              <Link className={cn(buttonVariants({ size: "md" }), "w-full sm:w-auto")} href="/?view=ai-coach">
                <CheckCircle2 className="size-4" />
                Abrir AI Coach
              </Link>
            ) : (
              <UpgradePlanButton className="w-full sm:w-auto" size="md" withIcon />
            )}
            <Link
              className={cn(buttonVariants({ variant: "secondary", size: "md" }), "w-full sm:w-auto")}
              href="/?view=settings"
            >
              <LockKeyhole className="size-4" />
              Configuracoes de seguranca
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface)] p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-[var(--fitai-text-primary)]">
                Dados da conta
              </h3>
            </div>
          </div>

          <dl className="mt-5 space-y-3">
            {identityItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  className="flex gap-3 rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-4"
                  key={item.label}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[rgba(79,124,255,0.10)] text-[var(--fitai-primary)]">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--fitai-text-muted)]">
                      {item.label}
                    </dt>
                    <dd className="mt-1 truncate text-sm font-semibold text-[var(--fitai-text-primary)]">
                      {item.value}
                    </dd>
                    <p className="mt-1 text-xs leading-5 text-[var(--fitai-text-secondary)]">
                      {item.helper}
                    </p>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface)] p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge>Assinatura</Badge>
            <h3 className="mt-3 text-lg font-semibold text-[var(--fitai-text-primary)]">
              Historico de pagamentos
            </h3>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] px-4 py-2 text-sm text-[var(--fitai-text-secondary)]">
            <CreditCard className="size-4" />
            Pix
          </div>
        </div>

        {paymentHistory.length > 0 ? (
          <div className="mt-5 space-y-3">
            {paymentHistory.map((payment) => (
              <div
                className="grid gap-3 rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-4 md:grid-cols-[1fr_auto_auto] md:items-center"
                key={payment.id}
              >
                <div className="flex gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[rgba(0,208,132,0.10)] text-[var(--fitai-success)]">
                    <ReceiptText className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--fitai-text-primary)]">
                      {payment.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--fitai-text-secondary)]">
                      {payment.description}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-[var(--fitai-text-primary)]">
                  {payment.amount}
                </p>
                <div className="flex items-center gap-3 md:justify-end">
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold",
                      payment.status === "Pago"
                        ? "border-[rgba(0,208,132,0.24)] bg-[rgba(0,208,132,0.10)] text-[var(--fitai-success)]"
                        : "border-[rgba(79,124,255,0.24)] bg-[rgba(79,124,255,0.10)] text-[var(--fitai-primary)]"
                    )}
                  >
                    {payment.status}
                  </span>
                  <span className="text-xs text-[var(--fitai-text-secondary)]">
                    {formatShortDate(payment.date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-6 text-center">
            <FileText className="mx-auto size-8 text-[var(--fitai-text-muted)]" />
            <p className="mt-3 text-sm font-semibold text-[var(--fitai-text-primary)]">
              Nenhuma cobranca de assinatura registrada
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--fitai-text-secondary)]">
              Quando o plano mensal for ativado, os pagamentos da assinatura aparecerao aqui com data,
              valor e status.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
