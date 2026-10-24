"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Dumbbell, Layers3, LoaderCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UpgradePlanButton } from "@/features/checkout/upgrade-plan-button";
import { OverviewCard } from "@/features/shared/components/overview-card";
import { hasActivePlan } from "@/lib/auth";
import { listWorkoutPlans } from "@/services/workout/client";
import type { AuthUser } from "@/types/auth";

export function EvolutionPage({ user }: { user: AuthUser }) {
  const active = hasActivePlan(user);
  const query = useQuery({
    queryKey: ["workout-plans"],
    queryFn: listWorkoutPlans,
    enabled: active
  });
  if (!active)
    return (
      <Card className="mx-auto max-w-xl p-8">
        <BarChart3 className="size-7 text-[var(--fitai-primary)]" />
        <h2 className="mt-5 text-2xl font-semibold tracking-tight">Olhe para seu planejamento.</h2>
        <p className="mb-6 mt-3 text-sm leading-6 text-[var(--fitai-text-secondary)]">
          Consulte a distribuição e o histórico das suas fichas com o plano Premium.
        </p>
        <UpgradePlanButton />
      </Card>
    );
  if (query.isPending)
    return (
      <Card
        role="status"
        className="flex items-center gap-3 p-6 text-sm text-[var(--fitai-text-secondary)]"
      >
        <LoaderCircle className="size-4 animate-spin" />
        Carregando seu planejamento...
      </Card>
    );
  if (query.isError)
    return (
      <Card role="alert" className="p-6">
        <p className="mb-4 text-sm text-[var(--fitai-text-secondary)]">
          Não foi possível carregar suas fichas.
        </p>
        <Button
          variant="secondary"
          disabled={query.isFetching}
          onClick={() => void query.refetch()}
        >
          Tentar novamente
        </Button>
      </Card>
    );
  const plans = query.data;
  if (plans.length === 0)
    return (
      <Card className="p-8">
        <Dumbbell className="size-7 text-[var(--fitai-primary)]" />
        <h2 className="mt-5 text-xl font-semibold">Todo planejamento tem um começo.</h2>
        <p className="mb-6 mt-3 text-sm text-[var(--fitai-text-secondary)]">
          Crie sua primeira ficha para consultar os detalhes por aqui.
        </p>
        <Link href="/?view=workouts" className={buttonVariants({})}>
          Criar meu treino
        </Link>
      </Card>
    );
  const totalExercises = plans.reduce((sum, plan) => sum + plan.exerciseCount, 0);
  const totalSessions = plans.reduce((sum, plan) => sum + plan.sessionCount, 0);
  const aiCount = plans.filter((plan) => plan.origin === "AI").length;
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <OverviewCard
          title="Fichas salvas"
          value={String(plans.length)}
          helper="no seu planejamento"
          icon={Dumbbell}
        />
        <OverviewCard
          title="Sessões planejadas"
          value={String(totalSessions)}
          helper="distribuídas nas fichas"
          icon={Layers3}
        />
        <OverviewCard
          title="Exercícios cadastrados"
          value={String(totalExercises)}
          helper="somados entre as fichas"
          icon={BarChart3}
        />
      </section>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Como você monta seus treinos</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">
            Distribuição das fichas salvas por origem.
          </p>
          <div className="mt-8 space-y-6">
            {[
              { label: "Criação manual", count: plans.length - aiCount },
              { label: "Criação assistida", count: aiCount }
            ].map(({ label, count }) => (
              <div key={label}>
                <div className="flex justify-between gap-3 text-sm">
                  <p>{label}</p>
                  <p className="tabular-nums text-[var(--fitai-text-secondary)]">
                    {count} de {plans.length}
                  </p>
                </div>
                <div
                  aria-hidden="true"
                  className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--fitai-surface-secondary)]"
                >
                  <div
                    className="h-full bg-[var(--fitai-primary)]"
                    style={{ width: `${(count / plans.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs leading-5 text-[var(--fitai-text-muted)]">
            Os dados representam seu planejamento. O registro de treinos concluídos ainda não está
            disponível.
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Fichas recentes</h2>
          <div className="mt-4 divide-y divide-[var(--fitai-border)]">
            {plans.slice(0, 5).map((plan) => (
              <Link
                key={plan.id}
                href="/?view=workouts"
                className="flex items-center justify-between gap-3 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{plan.title}</p>
                  <p className="mt-1 text-xs text-[var(--fitai-text-secondary)]">
                    {plan.exerciseCount} exercícios · {plan.sessionCount} sessões
                  </p>
                </div>
                {plan.active ? (
                  <span className="shrink-0 rounded-md bg-[var(--sidebar-accent)] px-2 py-1 text-[10px] font-medium text-[var(--fitai-primary)]">
                    Em uso
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
