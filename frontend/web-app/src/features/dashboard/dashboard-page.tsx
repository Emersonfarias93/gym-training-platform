"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  BrainCircuit,
  Clock3,
  Dumbbell,
  Layers3,
  LineChart,
  UtensilsCrossed
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { ComingSoonCard } from "@/features/dashboard/components/coming-soon-card";
import { CurrentSessionCard } from "@/features/dashboard/components/current-session-card";
import { LockedFeatureCard } from "@/features/dashboard/components/locked-feature-card";
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
  const isActivePlan = hasActivePlan(user);

  const overviewQuery = useQuery({ queryKey: ["workout-overview"], queryFn: getWorkoutOverview });
  const plansQuery = useQuery({ queryKey: ["workout-plans"], queryFn: listWorkoutPlans });

  const overview = overviewQuery.data ?? EMPTY_OVERVIEW;
  const plans = plansQuery.data ?? [];
  const metricsLoading = overviewQuery.isLoading || plansQuery.isLoading;
  const savedCount = plansQuery.isLoading ? "--" : String(plans.length);

  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="visible" custom={0} variants={reveal}>
        <WelcomeHero user={user} isActivePlan={isActivePlan} />
      </motion.div>

      <motion.section
        initial="hidden"
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
            value: metricsLoading ? "--" : String(overview.activeSessions),
            helper: "blocos prontos para uso",
            icon: Layers3
          },
          {
            title: "Volume da semana",
            value: metricsLoading ? "--" : overview.weeklyVolumeLabel,
            helper: "exercicios planejados",
            icon: Activity
          },
          {
            title: "Duracao media",
            value: metricsLoading ? "--" : overview.averageDurationLabel,
            helper: "tempo por sessao",
            icon: Clock3
          }
        ].map((metric, index) => (
          <motion.div key={metric.title} custom={index + 1} variants={reveal}>
            <OverviewCard title={metric.title} value={metric.value} helper={metric.helper} icon={metric.icon} />
          </motion.div>
        ))}
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <motion.div initial="hidden" animate="visible" custom={5} variants={reveal}>
          <CurrentSessionCard exercises={overview.currentSession} isLoading={overviewQuery.isLoading} />
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={6} variants={reveal}>
          {overview.programmedBlocks.length > 0 ? (
            <StackedListCard
              title="Seu planejamento"
              description="Proximos blocos do treino que voce escolheu como ativo."
              items={overview.programmedBlocks}
            />
          ) : (
            <Card className="flex h-full flex-col justify-center p-6">
              <h3 className="text-lg font-semibold text-[var(--fitai-text-primary)]">Seu planejamento</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">
                {overviewQuery.isError
                  ? "Nao foi possivel carregar seus treinos agora. Tente novamente em instantes."
                  : "Quando voce criar ou escolher um treino, os proximos blocos aparecem aqui."}
              </p>
            </Card>
          )}
        </motion.div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <motion.div initial="hidden" animate="visible" custom={7} variants={reveal}>
          {isActivePlan ? (
            <Card className="flex h-full flex-col p-6">
              <span className="w-fit rounded-2xl bg-[rgba(79,124,255,0.10)] p-3 text-[var(--fitai-primary)]">
                <BrainCircuit className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--fitai-text-primary)]">AI Coach</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">
                Converse com o AI Coach para ajustar treino e dieta. Insights automaticos chegam em breve.
              </p>
              <a
                className="mt-auto pt-6 text-sm font-semibold text-[var(--fitai-primary)] hover:underline"
                href="/?view=ai-coach"
              >
                Abrir AI Coach
              </a>
            </Card>
          ) : (
            <LockedFeatureCard
              icon={BrainCircuit}
              title="AI Coach"
              description="Um treinador com IA para tirar duvidas, ajustar treino e dieta sob medida."
              perks={["Conversas ilimitadas", "Recomendacoes personalizadas", "Geracao de treino por IA"]}
            />
          )}
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={8} variants={reveal}>
          <ComingSoonCard
            icon={UtensilsCrossed}
            title="Dieta"
            description="Acompanhamento de refeicoes, calorias e macros. Essa area esta sendo construida."
          />
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={9} variants={reveal}>
          <ComingSoonCard
            icon={LineChart}
            title="Evolucao"
            description="Peso, gordura, massa magra e fotos de progresso com historico e tendencias. Em breve."
          />
        </motion.div>
      </section>
    </div>
  );
}
