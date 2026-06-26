"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Clock3, Dumbbell, Flame, Layers3, LoaderCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SectionHeading } from "@/components/shared/section-heading";
import { OverviewCard } from "@/features/shared/components/overview-card";
import { StackedListCard } from "@/features/shared/components/stacked-list-card";
import { generateWorkout, getWorkoutOverview } from "@/services/workout/client";
import type { WorkoutOverviewResponse } from "@/types/workout";

const EMPTY_OVERVIEW: WorkoutOverviewResponse = {
  activeSessions: 0,
  weeklyVolumeLabel: "0 exercicios",
  averageDurationLabel: "0 min",
  averageIntensityLabel: "Sem dados",
  programmedBlocks: [],
  currentSession: []
};

export function WorkoutsPage() {
  const queryClient = useQueryClient();
  const overviewQuery = useQuery({
    queryKey: ["workout-overview"],
    queryFn: getWorkoutOverview
  });

  const generateMutation = useMutation({
    mutationFn: () => generateWorkout({ focus: "treino do dia" }),
    onSuccess: (overview) => {
      queryClient.setQueryData(["workout-overview"], overview);
    }
  });

  const overview = overviewQuery.data ?? EMPTY_OVERVIEW;
  const hasProgrammedBlocks = overview.programmedBlocks.length > 0;
  const hasCurrentSession = overview.currentSession.length > 0;
  const isLoading = overviewQuery.isLoading;
  const errorMessage =
    overviewQuery.isError || generateMutation.isError
      ? ((overviewQuery.error ?? generateMutation.error) as Error).message
      : null;

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Training Blocks"
        title="Visao operacional dos treinos ativos"
        description="Acompanhe treinos salvos pelo FitAI Coach, blocos programados e execucao da sessao atual."
        action={
          <Button
            disabled={generateMutation.isPending}
            onClick={() => generateMutation.mutate()}
            type="button"
          >
            {generateMutation.isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {generateMutation.isPending ? "Gerando..." : "Gerar treino com IA"}
          </Button>
        }
      />

      {errorMessage ? (
        <div className="flex items-center gap-2 rounded-2xl border border-[rgba(255,159,67,0.24)] bg-[rgba(255,159,67,0.10)] px-4 py-3 text-sm text-[var(--fitai-warning)]">
          <AlertCircle className="size-4 shrink-0" />
          {errorMessage}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          title="Sessoes ativas"
          value={isLoading ? "--" : String(overview.activeSessions)}
          helper="treinos programados ou em execucao"
          icon={Dumbbell}
        />
        <OverviewCard
          title="Volume semanal"
          value={isLoading ? "--" : overview.weeklyVolumeLabel}
          helper="exercicios planejados na semana"
          icon={Layers3}
        />
        <OverviewCard
          title="Tempo medio"
          value={isLoading ? "--" : overview.averageDurationLabel}
          helper="duracao estimada por sessao"
          icon={Clock3}
        />
        <OverviewCard
          title="Intensidade"
          value={isLoading ? "--" : overview.averageIntensityLabel}
          helper="primeiro bloco ativo como referencia"
          icon={Flame}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        {hasProgrammedBlocks ? (
          <StackedListCard
            title="Blocos programados"
            description="Grade dos proximos treinos organizada por dia e tipo de estimulo."
            items={overview.programmedBlocks}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--fitai-border)] bg-[var(--fitai-surface)] p-6">
            <h3 className="text-lg font-semibold text-[var(--fitai-text-primary)]">
              Nenhum bloco programado
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">
              Gere um treino com IA para salvar a primeira ficha no workout-service.
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface)] p-6">
          <h3 className="text-lg font-semibold text-[var(--fitai-text-primary)]">Execucao do treino atual</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">
            Painel compacto para acompanhar sua aderencia durante a sessao.
          </p>
          {hasCurrentSession ? (
            <div className="mt-6 space-y-4">
              {overview.currentSession.map((exercise) => (
                <div
                  key={exercise.id}
                  className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-[var(--fitai-text-primary)]">{exercise.name}</p>
                      <p className="mt-1 text-sm text-[var(--fitai-text-secondary)]">{exercise.sets}</p>
                    </div>
                    <span className="text-sm text-[var(--fitai-primary)]">{exercise.progress}%</span>
                  </div>
                  <Progress value={exercise.progress} className="mt-4 h-2.5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-5 text-sm leading-6 text-[var(--fitai-text-secondary)]">
              A sessao atual aparecera aqui assim que um treino for gerado ou salvo.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
