"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Crown,
  Dumbbell,
  LineChart,
  LoaderCircle,
  LockKeyhole,
  Sparkles,
  TrendingUp
} from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckoutDialog } from "@/features/checkout/checkout-dialog";
import { OverviewCard } from "@/features/shared/components/overview-card";
import { hasActivePlan } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getWorkoutOverview, listWorkoutPlans } from "@/services/workout/client";
import type { AuthUser } from "@/types/auth";
import type { WorkoutOverviewResponse, WorkoutPlanSummary } from "@/types/workout";

type EvolutionPageProps = {
  user: AuthUser;
};

const EMPTY_OVERVIEW: WorkoutOverviewResponse = {
  activeSessions: 0,
  weeklyVolumeLabel: "0 exercicios",
  averageDurationLabel: "0 min",
  averageIntensityLabel: "Sem dados",
  programmedBlocks: [],
  currentSession: []
};

function EvolutionUpgradeState() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="mx-auto grid min-h-[calc(100dvh-10rem)] max-w-4xl place-items-center rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-bg-shell)] p-6 lg:min-h-[calc(100dvh-8rem)]">
      <div className="max-w-xl text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl fitai-ai-gradient text-white">
          <LockKeyhole className="size-6" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--fitai-primary)]">
          Plano ativo
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-normal text-[var(--fitai-text-primary)]">
          Evolucao de treino disponivel para usuarios com plano ativo
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--fitai-text-secondary)]">
          Ative o plano para acompanhar treino ativo, distribuicao de fichas e sinais de consistencia a partir dos seus
          treinos salvos.
        </p>
        <Button className="mt-6" onClick={() => setCheckoutOpen(true)} type="button">
          <Crown className="size-4" />
          Ativar plano
        </Button>
      </div>
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "Sem data";
  }

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function percent(value: number, target: number) {
  if (target <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((value / target) * 100));
}

function buildEvolutionModel(plans: WorkoutPlanSummary[], overview: WorkoutOverviewResponse) {
  const activePlan = plans.find((plan) => plan.active) ?? null;
  const aiPlans = plans.filter((plan) => plan.origin === "AI").length;
  const manualPlans = plans.length - aiPlans;
  const totalExercises = plans.reduce((total, plan) => total + plan.exerciseCount, 0);
  const totalSessions = plans.reduce((total, plan) => total + plan.sessionCount, 0);
  const consistencyScore = Math.min(
    100,
    plans.length * 18 + overview.activeSessions * 14 + overview.currentSession.length * 4
  );

  return {
    activePlan,
    aiPlans,
    manualPlans,
    totalExercises,
    totalSessions,
    consistencyScore,
    latestPlans: [...plans]
      .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
      .slice(0, 4)
  };
}

function LoadingState() {
  return (
    <Card className="flex min-h-64 items-center justify-center p-6 text-sm text-[var(--fitai-text-secondary)]">
      <span className="inline-flex items-center gap-2">
        <LoaderCircle className="size-4 animate-spin text-[var(--fitai-primary)]" />
        Carregando sua evolucao...
      </span>
    </Card>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-[rgba(255,159,67,0.24)] bg-[rgba(255,159,67,0.10)] px-4 py-3 text-sm text-[var(--fitai-warning)]">
      <AlertCircle className="size-4 shrink-0" />
      {message}
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="p-6">
      <div className="max-w-2xl">
        <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(79,124,255,0.10)] text-[var(--fitai-primary)]">
          <Dumbbell className="size-5" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-[var(--fitai-text-primary)]">
          Crie ou escolha um treino para acompanhar sua evolucao
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">
          A evolucao usa os treinos salvos para mostrar frequencia, estrutura e consistencia do seu planejamento. Quando
          houver dados reais, os indicadores aparecem aqui automaticamente.
        </p>
        <Link className={cn(buttonVariants({ size: "md" }), "mt-5 w-full sm:w-auto")} href="/?view=workouts">
          <Dumbbell className="size-4" />
          Ir para treinos
        </Link>
      </div>
    </Card>
  );
}

export function EvolutionPage({ user }: EvolutionPageProps) {
  const canUseEvolution = hasActivePlan(user);

  const overviewQuery = useQuery({
    enabled: canUseEvolution,
    queryKey: ["workout-overview"],
    queryFn: getWorkoutOverview
  });
  const plansQuery = useQuery({
    enabled: canUseEvolution,
    queryKey: ["workout-plans"],
    queryFn: listWorkoutPlans
  });

  const overview = overviewQuery.data ?? EMPTY_OVERVIEW;
  const plans = plansQuery.data ?? [];
  const isLoading = overviewQuery.isLoading || plansQuery.isLoading;
  const errorMessage =
    overviewQuery.isError || plansQuery.isError
      ? ((overviewQuery.error ?? plansQuery.error) as Error).message
      : null;
  const model = useMemo(() => buildEvolutionModel(plans, overview), [plans, overview]);

  if (!canUseEvolution) {
    return <EvolutionUpgradeState />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  if (plans.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-[var(--fitai-border)] bg-[linear-gradient(135deg,rgba(79,124,255,0.14),rgba(10,12,16,0.96)_42%,rgba(0,208,132,0.08))]">
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:p-8">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="Evolucao"
              title="Seu progresso a partir dos treinos reais"
              description="Acompanhe como seu planejamento esta evoluindo com base nas fichas salvas, no treino ativo e na estrutura registrada na sua conta."
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--fitai-border)] bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--fitai-text-muted)]">
                  Treino ativo
                </p>
                <p className="mt-2 truncate text-sm font-semibold text-[var(--fitai-text-primary)]">
                  {model.activePlan?.title ?? "Nao definido"}
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--fitai-border)] bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--fitai-text-muted)]">
                  Foco atual
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--fitai-text-primary)]">
                  {overview.averageIntensityLabel}
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--fitai-border)] bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--fitai-text-muted)]">
                  Origem
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--fitai-text-primary)]">
                  {model.aiPlans} IA / {model.manualPlans} manual
                </p>
              </div>
            </div>
          </div>

          <Card className="bg-[rgba(10,12,16,0.55)] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--fitai-primary)]">
                  Consistencia
                </p>
                <p className="mt-3 text-4xl font-semibold text-[var(--fitai-text-primary)]">
                  {model.consistencyScore}%
                </p>
              </div>
              <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(0,208,132,0.10)] text-[var(--fitai-success)]">
                <TrendingUp className="size-5" />
              </div>
            </div>
            <Progress value={model.consistencyScore} className="mt-5 h-2.5" />
            <p className="mt-4 text-sm leading-6 text-[var(--fitai-text-secondary)]">
              Leitura calculada com treinos salvos, sessoes ativas e exercicios da sessao atual.
            </p>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <OverviewCard title="Treinos salvos" value={String(plans.length)} helper="fichas na sua conta" icon={Dumbbell} />
        <OverviewCard
          title="Exercicios totais"
          value={String(model.totalExercises)}
          helper={`${model.totalSessions} sessoes registradas`}
          icon={BarChart3}
        />
        <OverviewCard
          title="Treino ativo"
          value={model.activePlan ? "Definido" : "Pendente"}
          helper={model.activePlan?.title ?? "escolha um treino"}
          icon={CheckCircle2}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
        <Card className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Badge>Indicadores de treino</Badge>
              <h3 className="mt-3 text-lg font-semibold text-[var(--fitai-text-primary)]">
                Leitura do seu planejamento
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">
                Cada barra usa dados reais dos treinos salvos e do resumo atual.
              </p>
            </div>
            <Link className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "w-full sm:w-auto")} href="/?view=workouts">
              Ajustar treinos
            </Link>
          </div>

          <div className="mt-6 space-y-5">
            {[
              {
                label: "Treinos salvos",
                value: `${plans.length} fichas`,
                progress: percent(plans.length, 6),
                icon: Dumbbell
              },
              {
                label: "Exercicios cadastrados",
                value: `${model.totalExercises} exercicios`,
                progress: percent(model.totalExercises, 40),
                icon: LineChart
              }
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-2xl bg-[rgba(79,124,255,0.10)] text-[var(--fitai-primary)]">
                        <Icon className="size-4" />
                      </span>
                      <div>
                        <p className="font-medium text-[var(--fitai-text-primary)]">{item.label}</p>
                        <p className="text-sm text-[var(--fitai-text-secondary)]">{item.value}</p>
                      </div>
                    </div>
                    <span className="text-sm text-[var(--fitai-primary)]">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="mt-3 h-2.5" />
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--fitai-text-primary)]">Historico recente</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">
            Ultimos treinos salvos na sua conta, com origem, volume e data planejada.
          </p>

          <div className="mt-5 space-y-3">
            {model.latestPlans.map((plan) => (
              <div
                className={cn(
                  "rounded-2xl border bg-[var(--fitai-surface-elevated)] p-4",
                  plan.active ? "border-[rgba(79,124,255,0.42)]" : "border-[var(--fitai-border)]"
                )}
                key={plan.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={cn(
                          "gap-1.5 tracking-[0.12em]",
                          plan.origin === "AI"
                            ? "bg-[rgba(79,124,255,0.10)] text-[var(--fitai-primary)]"
                            : "bg-[rgba(255,255,255,0.03)] text-[var(--fitai-text-secondary)]"
                        )}
                      >
                        {plan.origin === "AI" ? <Sparkles className="size-3" /> : <Dumbbell className="size-3" />}
                        {plan.origin === "AI" ? "IA" : "Manual"}
                      </Badge>
                      {plan.active ? (
                        <Badge className="gap-1.5 border-[rgba(0,208,132,0.24)] bg-[rgba(0,208,132,0.10)] text-[var(--fitai-success)]">
                          <CheckCircle2 className="size-3" />
                          Ativo
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-3 truncate text-sm font-semibold text-[var(--fitai-text-primary)]">{plan.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--fitai-text-muted)]">
                      {plan.goal}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 text-xs text-[var(--fitai-text-secondary)] sm:grid-cols-3">
                  <span>{plan.exerciseCount} exercicios</span>
                  <span>{plan.estimatedDurationMinutes ? `${plan.estimatedDurationMinutes} min` : "-- min"}</span>
                  <span>{formatDate(plan.scheduledDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
