"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock3,
  Crown,
  Dumbbell,
  Flame,
  Layers3,
  LoaderCircle,
  Plus,
  RefreshCcw,
  Sparkles,
  Trash2
} from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { CheckoutDialog } from "@/features/checkout/checkout-dialog";
import { manualWorkoutSchema, type ManualWorkoutFormValues } from "@/features/workouts/schema";
import { OverviewCard } from "@/features/shared/components/overview-card";
import { StackedListCard } from "@/features/shared/components/stacked-list-card";
import { hasActivePlan } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { createManualWorkout, generateWorkout, getWorkoutOverview } from "@/services/workout/client";
import type { AuthUser } from "@/types/auth";
import type { CreateManualWorkoutInput, WorkoutOverviewResponse } from "@/types/workout";

type WorkoutObjectiveId = "strength" | "hypertrophy" | "recovery" | "periodization";

type WorkoutObjective = {
  id: WorkoutObjectiveId;
  label: string;
  manualGoal: string;
  requestFocus: string;
  title: string;
  description: string;
  helper: string;
  icon: typeof Dumbbell;
  defaultPlanTitle: string;
  defaultSessionTitle: string;
  recommendedIntensity: string;
};

const WORKOUT_OBJECTIVES: WorkoutObjective[] = [
  {
    id: "strength",
    label: "Forca",
    manualGoal: "STRENGTH",
    requestFocus: "forca",
    title: "Bloco com prioridade em carga e tecnica",
    description: "Bom para organizar exercicios base, progressao de carga e descansos um pouco maiores.",
    helper: "Use a ficha manual para registrar movimentos principais e acompanhar sua propria progressao.",
    icon: Dumbbell,
    defaultPlanTitle: "Plano de forca semanal",
    defaultSessionTitle: "Treino principal de forca",
    recommendedIntensity: "Alta"
  },
  {
    id: "hypertrophy",
    label: "Hipertrofia",
    manualGoal: "HYPERTROPHY",
    requestFocus: "hipertrofia",
    title: "Treino com foco em volume e construcao muscular",
    description: "Melhor para distribuir grupamentos, faixas de repeticao e volume total ao longo da semana.",
    helper: "Registre series, repeticoes e observacoes para comparar como seu treino evolui.",
    icon: Layers3,
    defaultPlanTitle: "Plano de hipertrofia",
    defaultSessionTitle: "Sessao de hipertrofia",
    recommendedIntensity: "Moderada alta"
  },
  {
    id: "recovery",
    label: "Recovery",
    manualGoal: "RECOVERY",
    requestFocus: "recovery",
    title: "Sessao para recuperar, mobilizar e manter consistencia",
    description: "Ajuda a deixar salvos treinos leves, mobilidade e dias de menor desgaste.",
    helper: "Use cargas livres, notas de mobilidade e descansos mais confortaveis.",
    icon: RefreshCcw,
    defaultPlanTitle: "Plano de recuperacao ativa",
    defaultSessionTitle: "Sessao de recovery",
    recommendedIntensity: "Leve"
  },
  {
    id: "periodization",
    label: "Periodizacao",
    manualGoal: "PERIODIZATION",
    requestFocus: "periodizacao",
    title: "Estrutura orientada por ciclo",
    description: "Funciona bem para registrar blocos por fase, mantendo a sessao organizada por objetivo do ciclo.",
    helper: "No plano ativo, esse foco segue como o melhor ponto de partida para a IA montar sua proxima ficha.",
    icon: BarChart3,
    defaultPlanTitle: "Plano de periodizacao",
    defaultSessionTitle: "Sessao do ciclo atual",
    recommendedIntensity: "Moderada"
  }
];

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

function getTodayInputValue() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function createDefaultExercise() {
  return {
    name: "",
    setsDescription: "3",
    repsDescription: "10",
    restSeconds: 60,
    loadSuggestion: "",
    executionNotes: ""
  };
}

function createDefaultManualValues(objective: WorkoutObjective): ManualWorkoutFormValues {
  return {
    title: objective.defaultPlanTitle,
    sessionTitle: objective.defaultSessionTitle,
    scheduledDate: getTodayInputValue(),
    estimatedDurationMinutes: 50,
    intensity: objective.recommendedIntensity,
    exercises: [createDefaultExercise()]
  };
}

function StatusBanner({
  message,
  tone
}: {
  message: string;
  tone: "error" | "success";
}) {
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

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-[var(--fitai-danger)]">{message}</p>;
}

function WorkoutObjectiveSelector({
  objectives,
  selectedObjective,
  onSelect
}: {
  objectives: WorkoutObjective[];
  selectedObjective: WorkoutObjective;
  onSelect: (objectiveId: WorkoutObjectiveId) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {objectives.map((objective) => {
        const Icon = objective.icon;
        const isSelected = objective.id === selectedObjective.id;

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

function PremiumExperienceCard({ onActivatePlan }: { onActivatePlan: () => void }) {
  return (
    <div className="rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(10,12,16,0.55)] p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--fitai-primary)]">
        Plano ativo
      </p>
      <h3 className="mt-4 text-2xl font-semibold text-[var(--fitai-text-primary)]">
        Com o plano ativo, a IA monta e ajusta sua ficha
      </h3>
      <p className="mt-3 text-sm leading-6 text-[var(--fitai-text-secondary)]">
        Libere geracao automatica por foco, acompanhamento da sessao atual e uma experiencia mais completa dentro do
        AI Coach.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <Button onClick={onActivatePlan} type="button">
          <Crown className="size-4" />
          Ativar plano
        </Button>
        <Link className={cn(buttonVariants({ variant: "secondary" }), "w-full")} href="/?view=account">
          Ver assinatura
        </Link>
      </div>
    </div>
  );
}

function WorkoutsSummaryCards({
  isLoading,
  overview
}: {
  isLoading: boolean;
  overview: WorkoutOverviewResponse;
}) {
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

function WorkoutsOverviewPanels({
  canUseWorkouts,
  overview
}: {
  canUseWorkouts: boolean;
  overview: WorkoutOverviewResponse;
}) {
  const hasProgrammedBlocks = overview.programmedBlocks.length > 0;
  const hasCurrentSession = overview.currentSession.length > 0;

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      {hasProgrammedBlocks ? (
        <StackedListCard
          title="Treinos no seu planejamento"
          description={
            canUseWorkouts
              ? "Blocos gerados para a sua conta, organizados pela sequencia do plano atual."
              : "Treinos manuais salvos na sua conta, prontos para consulta e ajuste."
          }
          items={overview.programmedBlocks}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--fitai-border)] bg-[var(--fitai-surface)] p-6">
          <h3 className="text-lg font-semibold text-[var(--fitai-text-primary)]">Nenhum treino criado ainda</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">
            {canUseWorkouts
              ? "Escolha entre forca, hipertrofia, recovery ou periodizacao e use o botao acima para gerar sua primeira ficha com IA."
              : "Preencha a ficha manual acima para salvar seu primeiro treino e comecar a organizar sua rotina."}
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface)] p-6">
        <h3 className="text-lg font-semibold text-[var(--fitai-text-primary)]">Sua sessao atual</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">
          Acompanhe o andamento do treino em execucao e enxergue rapidamente o que ja foi concluido.
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
            {canUseWorkouts
              ? "Sua sessao atual aparecera aqui assim que um treino for criado e entrar em execucao."
              : "Sua sessao atual aparecera aqui assim que voce salvar o primeiro treino manual."}
          </div>
        )}
      </div>
    </section>
  );
}

export function WorkoutsPage({ user }: WorkoutsPageProps) {
  const queryClient = useQueryClient();
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<WorkoutObjectiveId>("hypertrophy");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const canUseWorkouts = hasActivePlan(user);
  const selectedObjective =
    WORKOUT_OBJECTIVES.find((objective) => objective.id === selectedObjectiveId) ?? WORKOUT_OBJECTIVES[1];

  const form = useForm<ManualWorkoutFormValues>({
    resolver: zodResolver(manualWorkoutSchema),
    mode: "onChange",
    defaultValues: createDefaultManualValues(WORKOUT_OBJECTIVES[1])
  });

  const exercisesFieldArray = useFieldArray({
    control: form.control,
    name: "exercises"
  });

  useEffect(() => {
    if (canUseWorkouts) {
      return;
    }

    if (!form.formState.dirtyFields.title) {
      form.setValue("title", selectedObjective.defaultPlanTitle);
    }
    if (!form.formState.dirtyFields.sessionTitle) {
      form.setValue("sessionTitle", selectedObjective.defaultSessionTitle);
    }
    if (!form.formState.dirtyFields.intensity) {
      form.setValue("intensity", selectedObjective.recommendedIntensity);
    }
  }, [canUseWorkouts, form, form.formState.dirtyFields, selectedObjective]);

  const overviewQuery = useQuery({
    queryKey: ["workout-overview"],
    queryFn: getWorkoutOverview
  });

  const generateMutation = useMutation({
    mutationFn: () => generateWorkout({ focus: selectedObjective.requestFocus }),
    onMutate: () => {
      setSuccessMessage(null);
    },
    onSuccess: (overview) => {
      queryClient.setQueryData(["workout-overview"], overview);
      setSuccessMessage("Novo treino com IA gerado e salvo na sua conta.");
    }
  });

  const manualMutation = useMutation({
    mutationFn: (input: CreateManualWorkoutInput) => createManualWorkout(input),
    onMutate: () => {
      setSuccessMessage(null);
    },
    onSuccess: (overview) => {
      queryClient.setQueryData(["workout-overview"], overview);
      form.reset(createDefaultManualValues(selectedObjective));
      setSuccessMessage("Treino manual salvo com sucesso.");
    }
  });

  const overview = overviewQuery.data ?? EMPTY_OVERVIEW;
  const isLoading = overviewQuery.isLoading;
  const activeMutationError = canUseWorkouts ? generateMutation.error : manualMutation.error;
  const errorMessage =
    overviewQuery.isError || activeMutationError
      ? ((overviewQuery.error ?? activeMutationError) as Error).message
      : null;

  const onSubmitManual = form.handleSubmit(async (values) => {
    const payload: CreateManualWorkoutInput = {
      title: values.title,
      goal: selectedObjective.manualGoal,
      session: {
        title: values.sessionTitle,
        scheduledDate: values.scheduledDate,
        estimatedDurationMinutes: values.estimatedDurationMinutes,
        intensity: values.intensity,
        exercises: values.exercises.map((exercise) => ({
          name: exercise.name,
          setsDescription: exercise.setsDescription,
          repsDescription: exercise.repsDescription,
          restSeconds: exercise.restSeconds,
          loadSuggestion: exercise.loadSuggestion || undefined,
          executionNotes: exercise.executionNotes || undefined
        }))
      }
    };

    await manualMutation.mutateAsync(payload);
  });

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-[var(--fitai-border)] bg-[linear-gradient(135deg,rgba(79,124,255,0.14),rgba(10,12,16,0.96)_42%,rgba(0,208,132,0.08))]">
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:p-8">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Meus treinos"
              title={
                canUseWorkouts
                  ? "Escolha o foco e crie a sua proxima ficha"
                  : "Monte seu treino manualmente e organize sua rotina"
              }
              description={
                canUseWorkouts
                  ? "A area de treino passa a trabalhar como um espaco pessoal com geracao por IA, leitura do objetivo e acompanhamento do que pertence ao seu plano."
                  : "Usuarios comuns podem registrar seus proprios treinos, salvar sessoes pessoais e manter um historico simples dentro da plataforma."
              }
            />

            <WorkoutObjectiveSelector
              objectives={WORKOUT_OBJECTIVES}
              selectedObjective={selectedObjective}
              onSelect={setSelectedObjectiveId}
            />

            <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(10,12,16,0.42)] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fitai-primary)]">
                    {selectedObjective.label}
                  </p>
                  <h3 className="text-xl font-semibold text-[var(--fitai-text-primary)]">{selectedObjective.title}</h3>
                  <p className="max-w-2xl text-sm leading-6 text-[var(--fitai-text-secondary)]">
                    {selectedObjective.description}
                  </p>
                </div>

                {canUseWorkouts ? (
                  <Button
                    className="w-full md:w-auto"
                    disabled={generateMutation.isPending}
                    onClick={() => generateMutation.mutate()}
                    type="button"
                  >
                    {generateMutation.isPending ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Sparkles className="size-4" />
                    )}
                    {generateMutation.isPending ? "Gerando..." : "Criar treino com ia"}
                  </Button>
                ) : (
                  <div className="rounded-2xl border border-[var(--fitai-border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[var(--fitai-text-secondary)] md:max-w-64">
                    O foco escolhido organiza o cadastro manual agora e serve como base da geracao automatica quando o
                    plano estiver ativo.
                  </div>
                )}
              </div>

              <p className="mt-4 text-sm leading-6 text-[var(--fitai-text-secondary)]">{selectedObjective.helper}</p>
            </div>
          </div>

          {canUseWorkouts ? (
            <div className="rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(10,12,16,0.55)] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--fitai-primary)]">
                Seu resumo
              </p>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-[var(--fitai-border)] bg-[rgba(255,255,255,0.03)] p-4">
                  <p className="text-sm text-[var(--fitai-text-secondary)]">Treinos no seu plano</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--fitai-text-primary)]">
                    {isLoading ? "--" : String(overview.activeSessions)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--fitai-text-secondary)]">
                    Blocos pessoais programados ou em execucao.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[var(--fitai-border)] bg-[rgba(255,255,255,0.03)] p-4">
                    <p className="text-sm text-[var(--fitai-text-secondary)]">Volume planejado</p>
                    <p className="mt-2 text-xl font-semibold text-[var(--fitai-text-primary)]">
                      {isLoading ? "--" : overview.weeklyVolumeLabel}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[var(--fitai-border)] bg-[rgba(255,255,255,0.03)] p-4">
                    <p className="text-sm text-[var(--fitai-text-secondary)]">Duracao media</p>
                    <p className="mt-2 text-xl font-semibold text-[var(--fitai-text-primary)]">
                      {isLoading ? "--" : overview.averageDurationLabel}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--fitai-border)] bg-[rgba(255,255,255,0.03)] p-4">
                  <p className="text-sm text-[var(--fitai-text-secondary)]">Leitura do foco atual</p>
                  <p className="mt-2 text-xl font-semibold text-[var(--fitai-text-primary)]">
                    {isLoading ? "--" : overview.averageIntensityLabel}
                  </p>
                  <p className="mt-2 text-sm text-[var(--fitai-text-secondary)]">
                    Referencia extraida do seu bloco mais recente.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <PremiumExperienceCard onActivatePlan={() => setCheckoutOpen(true)} />
          )}
        </div>
      </section>

      {errorMessage ? <StatusBanner message={errorMessage} tone="error" /> : null}
      {successMessage ? <StatusBanner message={successMessage} tone="success" /> : null}

      {!canUseWorkouts ? (
        <section className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface)] p-6">
          <SectionHeading
            eyebrow="Cadastro manual"
            title="Salve seu treino do jeito que voce executa"
            description="Cadastre uma sessao com data, duracao, intensidade e a lista de exercicios. O historico salvo aparece logo abaixo."
          />

          <form className="mt-6 space-y-6" onSubmit={onSubmitManual}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--fitai-text-primary)]" htmlFor="workout-plan-title">
                  Titulo do plano
                </label>
                <Input id="workout-plan-title" placeholder="Ex.: Plano de hipertrofia da semana" {...form.register("title")} />
                <FieldError message={form.formState.errors.title?.message} />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-[var(--fitai-text-primary)]"
                  htmlFor="workout-session-title"
                >
                  Titulo da sessao
                </label>
                <Input
                  id="workout-session-title"
                  placeholder="Ex.: Treino A - membros superiores"
                  {...form.register("sessionTitle")}
                />
                <FieldError message={form.formState.errors.sessionTitle?.message} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--fitai-text-primary)]" htmlFor="workout-date">
                  Data do treino
                </label>
                <Input id="workout-date" type="date" {...form.register("scheduledDate")} />
                <FieldError message={form.formState.errors.scheduledDate?.message} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--fitai-text-primary)]" htmlFor="workout-duration">
                  Duracao estimada
                </label>
                <Input
                  id="workout-duration"
                  min={15}
                  max={240}
                  placeholder="50"
                  type="number"
                  {...form.register("estimatedDurationMinutes", { valueAsNumber: true })}
                />
                <FieldError message={form.formState.errors.estimatedDurationMinutes?.message} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--fitai-text-primary)]" htmlFor="workout-intensity">
                Intensidade
              </label>
              <Input
                id="workout-intensity"
                placeholder="Ex.: Moderada alta"
                {...form.register("intensity")}
              />
              <FieldError message={form.formState.errors.intensity?.message} />
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--fitai-text-primary)]">Exercicios</h3>
                  <p className="mt-1 text-sm text-[var(--fitai-text-secondary)]">
                    Monte a sessao exercicio por exercicio. Voce pode adicionar ate 12 itens.
                  </p>
                </div>
                <Button
                  disabled={exercisesFieldArray.fields.length >= 12}
                  onClick={() => exercisesFieldArray.append(createDefaultExercise())}
                  type="button"
                  variant="secondary"
                >
                  <Plus className="size-4" />
                  Adicionar exercicio
                </Button>
              </div>

              {exercisesFieldArray.fields.map((field, index) => {
                const exerciseErrors = form.formState.errors.exercises?.[index];

                return (
                  <div
                    key={field.id}
                    className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--fitai-primary)]">
                        Exercicio {index + 1}
                      </p>
                      <Button
                        aria-label={`Remover exercicio ${index + 1}`}
                        disabled={exercisesFieldArray.fields.length === 1}
                        onClick={() => exercisesFieldArray.remove(index)}
                        type="button"
                        variant="ghost"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <label
                          className="text-sm font-medium text-[var(--fitai-text-primary)]"
                          htmlFor={`exercise-name-${index}`}
                        >
                          Nome do exercicio
                        </label>
                        <Input
                          id={`exercise-name-${index}`}
                          placeholder="Ex.: Agachamento livre"
                          {...form.register(`exercises.${index}.name`)}
                        />
                        <FieldError message={exerciseErrors?.name?.message} />
                      </div>

                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium text-[var(--fitai-text-primary)]"
                          htmlFor={`exercise-sets-${index}`}
                        >
                          Series
                        </label>
                        <Input
                          id={`exercise-sets-${index}`}
                          placeholder="Ex.: 4"
                          {...form.register(`exercises.${index}.setsDescription`)}
                        />
                        <FieldError message={exerciseErrors?.setsDescription?.message} />
                      </div>

                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium text-[var(--fitai-text-primary)]"
                          htmlFor={`exercise-reps-${index}`}
                        >
                          Repeticoes
                        </label>
                        <Input
                          id={`exercise-reps-${index}`}
                          placeholder="Ex.: 8-10"
                          {...form.register(`exercises.${index}.repsDescription`)}
                        />
                        <FieldError message={exerciseErrors?.repsDescription?.message} />
                      </div>

                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium text-[var(--fitai-text-primary)]"
                          htmlFor={`exercise-rest-${index}`}
                        >
                          Descanso (segundos)
                        </label>
                        <Input
                          id={`exercise-rest-${index}`}
                          min={0}
                          max={600}
                          placeholder="60"
                          type="number"
                          {...form.register(`exercises.${index}.restSeconds`, { valueAsNumber: true })}
                        />
                        <FieldError message={exerciseErrors?.restSeconds?.message} />
                      </div>

                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium text-[var(--fitai-text-primary)]"
                          htmlFor={`exercise-load-${index}`}
                        >
                          Sugestao de carga
                        </label>
                        <Input
                          id={`exercise-load-${index}`}
                          placeholder="Ex.: RPE 7 ou 20 kg"
                          {...form.register(`exercises.${index}.loadSuggestion`)}
                        />
                        <FieldError message={exerciseErrors?.loadSuggestion?.message} />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label
                          className="text-sm font-medium text-[var(--fitai-text-primary)]"
                          htmlFor={`exercise-notes-${index}`}
                        >
                          Observacoes
                        </label>
                        <Textarea
                          id={`exercise-notes-${index}`}
                          placeholder="Ex.: controlar a descida, evitar falha na ultima serie..."
                          {...form.register(`exercises.${index}.executionNotes`)}
                        />
                        <FieldError message={exerciseErrors?.executionNotes?.message} />
                      </div>
                    </div>
                  </div>
                );
              })}

              <FieldError
                message={typeof form.formState.errors.exercises?.message === "string"
                  ? form.formState.errors.exercises.message
                  : undefined}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-[var(--fitai-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--fitai-text-secondary)]">
                O treino salvo fica associado ao foco <span className="text-[var(--fitai-text-primary)]">{selectedObjective.label}</span>.
              </p>
              <Button disabled={manualMutation.isPending} size="lg" type="submit">
                {manualMutation.isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Dumbbell className="size-4" />}
                {manualMutation.isPending ? "Salvando..." : "Salvar treino manual"}
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      <WorkoutsSummaryCards isLoading={isLoading} overview={overview} />
      <WorkoutsOverviewPanels canUseWorkouts={canUseWorkouts} overview={overview} />

      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  );
}
