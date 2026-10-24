import Link from "next/link";
import { CalendarDays, Check, Mail, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { UpgradePlanButton } from "@/features/checkout/upgrade-plan-button";
import { FITAI_PREMIUM_PLAN, formatBRL } from "@/lib/payment";
import { hasActivePlan } from "@/lib/auth";
import type { AuthUser } from "@/types/auth";

function formatDate(value?: string | null) {
  if (!value || Number.isNaN(new Date(value).getTime())) return "Não informado";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "America/Sao_Paulo"
  }).format(new Date(value));
}

export function AccountPage({ user }: { user: AuthUser }) {
  const active = hasActivePlan(user);
  return (
    <div className="grid items-start gap-6 xl:grid-cols-2">
      <Card className="p-6 md:p-7">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--fitai-text-muted)]">
          Seu plano
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">
            {active ? (user.planName ?? FITAI_PREMIUM_PLAN.name) : "Plano gratuito"}
          </h2>
          <Badge>{active ? "Ativo" : "Gratuito"}</Badge>
        </div>
        <p className="mt-3 text-sm leading-6 text-[var(--fitai-text-secondary)]">
          {active
            ? "Seus recursos de treino assistido e o coach estão disponíveis."
            : "Organize sua rotina com até dois treinos manuais. Conheça o Premium para ampliar suas possibilidades."}
        </p>
        <div className="my-6 border-y border-[var(--fitai-border)] py-5">
          <p className="text-xs text-[var(--fitai-text-muted)]">
            {active ? "Valor mensal do plano" : "FitAI Premium"}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
            {formatBRL(FITAI_PREMIUM_PLAN.priceBRL)}
            <span className="ml-1 text-sm font-normal text-[var(--fitai-text-muted)]">/ mês</span>
          </p>
          {active ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-[var(--fitai-text-secondary)]">
              <CalendarDays className="size-4" />
              Acesso até {formatDate(user.currentPeriodEnd)}
            </p>
          ) : null}
        </div>
        <ul className="mb-7 space-y-3">
          {[
            "Geração assistida de treinos",
            "Conversa com seu coach",
            "Mais fichas para organizar sua rotina"
          ].map((benefit) => (
            <li
              key={benefit}
              className="flex items-center gap-3 text-sm text-[var(--fitai-text-secondary)]"
            >
              <Check className="size-4 text-[var(--fitai-primary)]" />
              {benefit}
            </li>
          ))}
        </ul>
        {active ? (
          <Link className={buttonVariants({ variant: "secondary" })} href="/?view=ai-coach">
            Conversar com meu coach
          </Link>
        ) : (
          <UpgradePlanButton withIcon />
        )}
      </Card>
      <Card className="p-6 md:p-7">
        <h2 className="text-lg font-semibold">Dados da conta</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">
          Informações usadas no seu acesso à plataforma.
        </p>
        <dl className="mt-6 divide-y divide-[var(--fitai-border)]">
          {[
            { label: "Nome", value: user.fullName, icon: UserRound },
            { label: "E-mail", value: user.email, icon: Mail }
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex gap-4 py-5">
              <Icon className="mt-1 size-4 shrink-0 text-[var(--fitai-text-muted)]" />
              <div className="min-w-0">
                <dt className="text-xs text-[var(--fitai-text-muted)]">{label}</dt>
                <dd className="mt-1 break-words text-sm font-medium">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
