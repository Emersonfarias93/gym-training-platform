"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Activity, BrainCircuit, Clock3, Dumbbell, Layers3, ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { CurrentSessionCard } from "@/features/dashboard/components/current-session-card";
import { WelcomeHero } from "@/features/dashboard/components/welcome-hero";
import { OverviewCard } from "@/features/shared/components/overview-card";
import { StackedListCard } from "@/features/shared/components/stacked-list-card";
import { hasActivePlan } from "@/lib/auth";
import { getWorkoutOverview, listWorkoutPlans } from "@/services/workout/client";
import type { AuthUser } from "@/types/auth";
import type { WorkoutOverviewResponse } from "@/types/workout";

const EMPTY_OVERVIEW: WorkoutOverviewResponse = {
  activeSessions: 0,
  weeklyVolumeLabel: "0 exercicios",
  averageDurationLabel: "0 min",
  averageIntensityLabel: "Sem dados",
  programmedBlocks: [],
  currentSession: []
};

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: index * 0.05 }
  })
};

type DashboardPageProps = {
  user: AuthUser;
};

export function DashboardPage({ user }: DashboardPageProps) {
  const reduceMotion = useReducedMotion();
  const isActivePlan = hasActivePlan(user);

  const overviewQuery = useQuery({ queryKey: ["workout-overview"], queryFn: getWorkoutOverview });
  const plansQuery = useQuery({ queryKey: ["workout-plans"], queryFn: listWorkoutPlans });

  const overview = overviewQuery.data ?? EMPTY_OVERVIEW;
  const plans = plansQuery.data ?? [];
  const metricsLoading = overviewQuery.isLoading || plansQuery.isLoading;
  const metricsUnavailable = metricsLoading || overviewQuery.isError;
  const savedCount = plansQuery.isLoading || plansQuery.isError ? "--" : String(plans.length);

  return (
    <div className="space-y-6">
      <motion.div
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        custom={0}
        variants={reveal}
      >
        <WelcomeHero user={user} isActivePlan={isActivePlan} />
      </motion.div>

      {overviewQuery.isError || plansQuery.isError ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--fitai-border-strong)] bg-[var(--fitai-surface)] px-4 py-3 text-sm"
        >
          <p className="text-[var(--fitai-text-secondary)]">
            Não foi possível carregar todos os dados do treino.
          </p>
          <Button
            variant="secondary"
            size="sm"
            disabled={overviewQuery.isFetching || plansQuery.isFetching}
            onClick={() => {
              void overviewQuery.refetch();
              void plansQuery.refetch();
            }}
          >
            Tentar novamente
          </Button>
        </div>
      ) : null}
      <motion.section
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        {[
          {
            title: "Treinos salvos",
            value: savedCount,
            helper: "fichas na sua conta",
            icon: Dumbbell
          },
          {
            title: "Treinos ativos",
            value: metricsUnavailable ? "--" : String(overview.activeSessions),
            helper: "blocos prontos para uso",
            icon: Layers3
          },
          {
            title: "Volume da semana",
            value: metricsUnavailable ? "--" : overview.weeklyVolumeLabel,
            helper: "exercícios planejados",
            icon: Activity
          },
          {
            title: "Duração média",
            value: metricsUnavailable ? "--" : overview.averageDurationLabel,
            helper: "tempo por sessao",
            icon: Clock3
          }
        ].map((metric, index) => (
          <motion.div key={metric.title} custom={index + 1} variants={reveal}>
            <OverviewCard
              title={metric.title}
              value={metric.value}
              helper={metric.helper}
              icon={metric.icon}
            />
          </motion.div>
        ))}
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          custom={5}
          variants={reveal}
        >
          <CurrentSessionCard
            exercises={overview.currentSession}
            isLoading={overviewQuery.isLoading}
            isError={overviewQuery.isError}
          />
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          custom={6}
          variants={reveal}
        >
          {overview.programmedBlocks.length > 0 ? (
            <StackedListCard
              title="Seu planejamento"
              description="Próximos blocos do seu planejamento."
              items={overview.programmedBlocks}
            />
          ) : (
            <Card className="flex h-full flex-col justify-center p-6">
              <h3 className="text-lg font-semibold text-[var(--fitai-text-primary)]">
                Seu planejamento
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">
                {overviewQuery.isError
                  ? "Nao foi possivel carregar seus treinos agora. Tente novamente em instantes."
                  : "Crie ou escolha um treino para ver seus próximos blocos aqui."}
              </p>
            </Card>
          )}
        </motion.div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--fitai-border)] bg-[var(--fitai-surface)] p-5">
        <div className="flex items-center gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--sidebar-accent)] text-[var(--fitai-primary)]">
            <BrainCircuit className="size-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Uma dúvida sobre seu treino?</h3>
            <p className="mt-1 text-xs leading-5 text-[var(--fitai-text-secondary)]">
              {isActivePlan
                ? "Seu coach pode ajudar a pensar no próximo passo."
                : "Conheça o assistente de treino incluído no plano Premium."}
            </p>
          </div>
        </div>
        <Link
          href={isActivePlan ? "/?view=ai-coach" : "/?view=account"}
          className="inline-flex min-h-10 items-center gap-3 text-sm font-medium text-[var(--fitai-primary)] hover:underline"
        >
          {isActivePlan ? "Conversar com meu coach" : "Conhecer o plano"}
          <ArrowUpRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}
