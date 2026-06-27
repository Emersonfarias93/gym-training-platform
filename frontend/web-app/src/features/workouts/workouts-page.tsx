"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Crown,
  Dumbbell,
  Flame,
  Layers3,
  LoaderCircle,
  Plus,
  Sparkles
} from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CheckoutDialog } from "@/features/checkout/checkout-dialog";
import { OverviewCard } from "@/features/shared/components/overview-card";
import { WorkoutCard } from "@/features/workouts/workout-card";
import { WorkoutEditorDialog } from "@/features/workouts/workout-editor-dialog";
import {
  WORKOUT_OBJECTIVES,
  getObjectiveById,
  type WorkoutObjectiveId
} from "@/features/workouts/workout-objectives";
import { hasActivePlan } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  activateWorkoutPlan,
  deleteWorkoutPlan,
  generateWorkout,
  getWorkoutOverview,
  getWorkoutPlan,
  listWorkoutPlans
} from "@/services/workout/client";
import type { AuthUser } from "@/types/auth";
import type { WorkoutOverviewResponse, WorkoutPlanDetail, WorkoutPlanSummary } from "@/types/workout";

const EMPTY_OVERVIEW: WorkoutOverviewResponse = {
  activeSessions: 0,
  weeklyVolumeLabel: "0 exercicios",
  averageDurationLabel: "0 min",
  averageIntensityLabel: "Sem dados",
  programmedBlocks: [],
  currentSession: []
};

type WorkoutsPageProps = {
  user: AuthUser;
};

type EditorState = {
  open: boolean;
  mode: "create" | "edit";
  plan: WorkoutPlanDetail | null;
};

function StatusBanner({ message, tone }: { message: string; tone: "error" | "success" }) {
  const Icon = tone === "error" ? AlertCircle : CheckCircle2;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-2xl px-4 py-3 text-sm",
        tone === "error"
          ? "border border-[rgba(255,159,67,0.24)] bg-[rgba(255,159,67,0.10)] text-[var(--fitai-warning)]"
          : "border border-[rgba(0,208,132,0.20)] bg-[rgba(0,208,132,0.10)] text-[var(--fitai-success)]"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {message}
    </div>
  );
}

function WorkoutObjectiveSelector({
  selectedObjectiveId,
  onSelect
}: {
  selectedObjectiveId: WorkoutObjectiveId;
  onSelect: (objectiveId: WorkoutObjectiveId) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {WORKOUT_OBJECTIVES.map((objective) => {
        const Icon = objective.icon;
        const isSelected = objective.id === selectedObjectiveId;
        return (
          <button
            key={objective.id}
            aria-pressed={isSelected}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              isSelected
                ? "border-transparent bg-white text-[var(--fitai-bg-shell)]"
                : "border-[var(--fitai-border-strong)] bg-[rgba(21,24,31,0.82)] text-[var(--fitai-text-secondary)] hover:text-[var(--fitai-text-primary)]"
            )}
            onClick={() => onSelect(objective.id)}
            type="button"
          >
            <Icon className="size-4" />
            {objective.label}
          </button>
        );
      })}
    </div>
  );
}

function WorkoutsSummaryCards({ isLoading, overview }: { isLoading: boolean; overview: WorkoutOverviewResponse }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <OverviewCard
        title="Treinos ativos"
        value={isLoading ? "--" : String(overview.activeSessions)}
        helper="blocos seus prontos para uso"
        icon={Dumbbell}
      />
      <OverviewCard
        title="Volume da semana"
        value={isLoading ? "--" : overview.weeklyVolumeLabel}
        helper="exercicios planejados no seu ciclo"
        icon={Layers3}
      />
      <OverviewCard
        title="Duracao media"
        value={isLoading ? "--" : overview.averageDurationLabel}
        helper="tempo estimado por sessao"
        icon={Clock3}
      />
      <OverviewCard
        title="Intensidade-base"
        value={isLoading ? "--" : overview.averageIntensityLabel}
        helper="referencia do bloco mais recente"
        icon={Flame}
      />
    </section>
  );
}

function CurrentSessionPanel({ overview }: { overview: WorkoutOverviewResponse }) {
  const hasCurrentSession = overview.currentSession.length > 0;
  return (
    <div className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface)] p-6">
      <h3 className="text-lg font-semibold text-[var(--fitai-text-primary)]">Sua sessao atual</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">
        Reflete o treino que voce escolheu como ativo. Use "Escolher" em qualquer treino para troca-lo.
      </p>
      {hasCurrentSession ? (
        <div className="mt-6 space-y-4">
          {overview.currentSession.map((exercise) => (
            <div
              key={exercise.id}
              className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-4"
            >
              <div>
                <p className="font-medium text-[var(--fitai-text-primary)]">{exercise.name}</p>
                <p className="mt-1 text-sm text-[var(--fitai-text-secondary)]">{exercise.sets}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-5 text-sm leading-6 text-[var(--fitai-text-secondary)]">
          Escolha um treino da sua lista para ele aparecer aqui como sessao atual.
        </div>
      )}
    </div>
  );
}

export function WorkoutsPage({ user }: WorkoutsPageProps) {
  const queryClient = useQueryClient();
  const canUseAi = hasActivePlan(user);

  const [selectedObjectiveId, setSelectedObjectiveId] = useState<WorkoutObjectiveId>("hypertrophy");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [editor, setEditor] = useState<EditorState>({ open: false, mode: "create", plan: null });
  const [deleteTarget, setDeleteTarget] = useState<WorkoutPlanSummary | null>(null);
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; tone: "error" | "success" } | null>(null);

  const selectedObjective = getObjectiveById(selectedObjectiveId);

  const overviewQuery = useQuery({ queryKey: ["workout-overview"], queryFn: getWorkoutOverview });
  const plansQuery = useQuery({ queryKey: ["workout-plans"], queryFn: listWorkoutPlans });

  const overview = overviewQuery.data ?? EMPTY_OVERVIEW;
  const plans = plansQuery.data ?? [];

  function refreshAfterChange(overviewData?: WorkoutOverviewResponse) {
    if (overviewData) {
      queryClient.setQueryData(["workout-overview"], overviewData);
    } else {
      void queryClient.invalidateQueries({ queryKey: ["workout-overview"] });
    }
    void queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
  }

  const generateMutation = useMutation({
    mutationFn: () => generateWorkout({ focus: selectedObjective.requestFocus }),
    onMutate: () => setFeedback(null),
    onSuccess: (overviewData) => {
      refreshAfterChange(overviewData);
      setFeedback({ message: "Novo treino com IA gerado e em uso.", tone: "success" });
    },
    onError: (error) => setFeedback({ message: (error as Error).message, tone: "error" })
  });

  const activateMutation = useMutation({
    mutationFn: (planId: string) => activateWorkoutPlan(planId),
    onMutate: (planId) => {
      setPendingPlanId(planId);
      setFeedback(null);
    },
    onSuccess: (overviewData) => {
      refreshAfterChange(overviewData);
      setFeedback({ message: "Treino escolhido como ativo.", tone: "success" });
    },
    onError: (error) => setFeedback({ message: (error as Error).message, tone: "error" }),
    onSettled: () => setPendingPlanId(null)
  });

  const deleteMutation = useMutation({
    mutationFn: (planId: string) => deleteWorkoutPlan(planId),
    onMutate: (planId) => {
      setPendingPlanId(planId);
      setFeedback(null);
    },
    onSuccess: () => {
      refreshAfterChange();
      setFeedback({ message: "Treino excluido.", tone: "success" });
    },
    onError: (error) => setFeedback({ message: (error as Error).message, tone: "error" }),
    onSettled: () => {
      setPendingPlanId(null);
      setDeleteTarget(null);
    }
  });

  async function openEditorForPlan(planId: string) {
    setPendingPlanId(planId);
    setFeedback(null);
    try {
      const detail = await getWorkoutPlan(planId);
      setEditor({ open: true, mode: "edit", plan: detail });
    } catch (error) {
      setFeedback({ message: (error as Error).message, tone: "error" });
    } finally {
      setPendingPlanId(null);
    }
  }

  const listError = plansQuery.isError ? (plansQuery.error as Error).message : null;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-[var(--fitai-border)] bg-[linear-gradient(135deg,rgba(79,124,255,0.14),rgba(10,12,16,0.96)_42%,rgba(0,208,132,0.08))]">
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:p-8">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Meus treinos"
              title={canUseAi ? "Gere, salve e gerencie seus treinos" : "Monte e gerencie seus treinos"}
              description={
                canUseAi
                  ? "Crie treinos com IA ou manualmente, escolha qual fica ativo, edite os exercicios e exclua o que nao usa mais."
                  : "Cadastre seus treinos, escolha qual fica ativo, edite os exercicios e exclua quando quiser."
              }
            />

            <WorkoutObjectiveSelector selectedObjectiveId={selectedObjectiveId} onSelect={setSelectedObjectiveId} />

            <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(10,12,16,0.42)] p-5">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fitai-primary)]">
                  {selectedObjective.label}
                </p>
                <h3 className="text-xl font-semibold text-[var(--fitai-text-primary)]">{selectedObjective.title}</h3>
                <p className="max-w-2xl text-sm leading-6 text-[var(--fitai-text-secondary)]">
                  {selectedObjective.description}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {canUseAi ? (
                  <Button disabled={generateMutation.isPending} onClick={() => generateMutation.mutate()} type="button">
                    {generateMutation.isPending ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Sparkles className="size-4" />
                    )}
                    {generateMutation.isPending ? "Gerando..." : "Criar treino com IA"}
                  </Button>
                ) : null}
                <Button
                  onClick={() => setEditor({ open: true, mode: "create", plan: null })}
                  type="button"
                  variant={canUseAi ? "secondary" : "primary"}
                >
                  <Plus className="size-4" />
                  Novo treino manual
                </Button>
              </div>
            </div>
          </div>

          {canUseAi ? (
            <div className="rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(10,12,16,0.55)] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--fitai-primary)]">Seu resumo</p>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-[var(--fitai-border)] bg-[rgba(255,255,255,0.03)] p-4">
                  <p className="text-sm text-[var(--fitai-text-secondary)]">Treinos salvos</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--fitai-text-primary)]">
                    {plansQuery.isLoading ? "--" : plans.length}
                  </p>
                  <p className="mt-2 text-sm text-[var(--fitai-text-secondary)]">Disponiveis na sua lista pessoal.</p>
                </div>
                <div className="rounded-2xl border border-[var(--fitai-border)] bg-[rgba(255,255,255,0.03)] p-4">
                  <p className="text-sm text-[var(--fitai-text-secondary)]">Leitura do foco atual</p>
                  <p className="mt-2 text-xl font-semibold text-[var(--fitai-text-primary)]">
                    {overviewQuery.isLoading ? "--" : overview.averageIntensityLabel}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(10,12,16,0.55)] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--fitai-primary)]">Plano ativo</p>
              <h3 className="mt-4 text-2xl font-semibold text-[var(--fitai-text-primary)]">
                Libere a geracao de treinos com IA
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--fitai-text-secondary)]">
                Voce ja pode criar, editar e organizar treinos manuais. Com o plano ativo, a IA monta a ficha por voce.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Button onClick={() => setCheckoutOpen(true)} type="button">
                  <Crown className="size-4" />
                  Ativar plano
                </Button>
                <Link className={cn(buttonVariants({ variant: "secondary" }), "w-full")} href="/?view=account">
                  Ver assinatura
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {feedback ? <StatusBanner message={feedback.message} tone={feedback.tone} /> : null}
      {listError ? <StatusBanner message={listError} tone="error" /> : null}

      <WorkoutsSummaryCards isLoading={overviewQuery.isLoading} overview={overview} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[var(--fitai-text-primary)]">Meus treinos</h2>
            <span className="text-sm text-[var(--fitai-text-muted)]">
              {plansQuery.isLoading ? "" : `${plans.length} ${plans.length === 1 ? "treino" : "treinos"}`}
            </span>
          </div>

          {plansQuery.isLoading ? (
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface)] p-6 text-sm text-[var(--fitai-text-secondary)]">
              <LoaderCircle className="size-4 animate-spin" />
              Carregando seus treinos...
            </div>
          ) : plansQuery.isError ? null : plans.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--fitai-border)] bg-[var(--fitai-surface)] p-6">
              <h3 className="text-lg font-semibold text-[var(--fitai-text-primary)]">Nenhum treino salvo ainda</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">
                {canUseAi
                  ? "Use \"Criar treino com IA\" ou \"Novo treino manual\" para salvar seu primeiro treino."
                  : "Use \"Novo treino manual\" para salvar seu primeiro treino e comecar a organizar sua rotina."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map((plan) => (
                <WorkoutCard
                  key={plan.id}
                  plan={plan}
                  busy={pendingPlanId === plan.id}
                  onChoose={() => activateMutation.mutate(plan.id)}
                  onEdit={() => void openEditorForPlan(plan.id)}
                  onDelete={() => setDeleteTarget(plan)}
                />
              ))}
            </div>
          )}
        </div>

        <CurrentSessionPanel overview={overview} />
      </section>

      <WorkoutEditorDialog
        open={editor.open}
        onOpenChange={(open) => setEditor((current) => ({ ...current, open }))}
        mode={editor.mode}
        plan={editor.plan}
        initialObjective={selectedObjective}
        onSaved={() =>
          setFeedback({
            message: editor.mode === "edit" ? "Treino atualizado." : "Treino manual salvo com sucesso.",
            tone: "success"
          })
        }
      />

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        title="Excluir treino"
        description={deleteTarget ? `"${deleteTarget.title}" sera removido com todos os exercicios.` : undefined}
      >
        <div className="flex items-center justify-end gap-3">
          <Button onClick={() => setDeleteTarget(null)} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button
            className="bg-[var(--fitai-danger)] text-white hover:bg-[#e85a5a]"
            disabled={deleteMutation.isPending}
            onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            type="button"
          >
            {deleteMutation.isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
            Excluir
          </Button>
        </div>
      </Dialog>

      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  );
}
