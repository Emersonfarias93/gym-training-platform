"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, type UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, LoaderCircle, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { workoutEditorSchema, type WorkoutEditorValues } from "@/features/workouts/schema";
import {
  WORKOUT_OBJECTIVES,
  getObjectiveByGoal,
  type WorkoutObjective
} from "@/features/workouts/workout-objectives";
import { cn } from "@/lib/utils";
import { createManualWorkout, updateWorkoutPlan } from "@/services/workout/client";
import type {
  ManualWorkoutSessionInput,
  WorkoutPlanDetail
} from "@/types/workout";

type EditorMode = "create" | "edit";

type WorkoutEditorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: EditorMode;
  /** Treino a editar (mode === "edit"). */
  plan?: WorkoutPlanDetail | null;
  /** Foco inicial para um novo treino manual (mode === "create"). */
  initialObjective?: WorkoutObjective;
  onSaved: () => void;
};

function getTodayInputValue() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function createEmptyExercise() {
  return {
    name: "",
    setsDescription: "3",
    repsDescription: "10",
    restSeconds: 60,
    loadSuggestion: "",
    executionNotes: ""
  };
}

function createDefaultValues(
  mode: EditorMode,
  plan: WorkoutPlanDetail | null | undefined,
  objective: WorkoutObjective
): WorkoutEditorValues {
  if (mode === "edit" && plan) {
    return {
      title: plan.title,
      goal: plan.goal,
      sessions: plan.sessions.map((session) => ({
        title: session.title,
        scheduledDate: session.scheduledDate,
        estimatedDurationMinutes: session.estimatedDurationMinutes ?? 50,
        intensity: session.intensity ?? objective.recommendedIntensity,
        exercises: session.exercises.map((exercise) => ({
          name: exercise.name,
          setsDescription: exercise.setsDescription,
          repsDescription: exercise.repsDescription,
          restSeconds: exercise.restSeconds ?? 60,
          loadSuggestion: exercise.loadSuggestion ?? "",
          executionNotes: exercise.executionNotes ?? ""
        }))
      }))
    };
  }

  return {
    title: objective.defaultPlanTitle,
    goal: objective.manualGoal,
    sessions: [
      {
        title: objective.defaultSessionTitle,
        scheduledDate: getTodayInputValue(),
        estimatedDurationMinutes: 50,
        intensity: objective.recommendedIntensity,
        exercises: [createEmptyExercise()]
      }
    ]
  };
}

function toSessionInput(session: WorkoutEditorValues["sessions"][number]): ManualWorkoutSessionInput {
  return {
    title: session.title,
    scheduledDate: session.scheduledDate,
    estimatedDurationMinutes: session.estimatedDurationMinutes,
    intensity: session.intensity,
    exercises: session.exercises.map((exercise) => ({
      name: exercise.name,
      setsDescription: exercise.setsDescription,
      repsDescription: exercise.repsDescription,
      restSeconds: exercise.restSeconds,
      loadSuggestion: exercise.loadSuggestion || undefined,
      executionNotes: exercise.executionNotes || undefined
    }))
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="text-sm text-[var(--fitai-danger)]">{message}</p>;
}

function SessionFields({
  form,
  sessionIndex,
  allowRemove,
  onRemove
}: {
  form: UseFormReturn<WorkoutEditorValues>;
  sessionIndex: number;
  allowRemove: boolean;
  onRemove: () => void;
}) {
  const exercises = useFieldArray({
    control: form.control,
    name: `sessions.${sessionIndex}.exercises`
  });
  const sessionErrors = form.formState.errors.sessions?.[sessionIndex];

  return (
    <div className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--fitai-primary)]">
          Dia {sessionIndex + 1}
        </p>
        {allowRemove ? (
          <Button aria-label={`Remover dia ${sessionIndex + 1}`} onClick={onRemove} type="button" variant="ghost">
            <Trash2 className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-[var(--fitai-text-primary)]">Titulo do dia</label>
          <Input
            placeholder="Ex.: Treino A - membros superiores"
            {...form.register(`sessions.${sessionIndex}.title`)}
          />
          <FieldError message={sessionErrors?.title?.message} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--fitai-text-primary)]">Data</label>
          <Input type="date" {...form.register(`sessions.${sessionIndex}.scheduledDate`)} />
          <FieldError message={sessionErrors?.scheduledDate?.message} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--fitai-text-primary)]">Duracao (min)</label>
          <Input
            min={15}
            max={240}
            type="number"
            {...form.register(`sessions.${sessionIndex}.estimatedDurationMinutes`, { valueAsNumber: true })}
          />
          <FieldError message={sessionErrors?.estimatedDurationMinutes?.message} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-[var(--fitai-text-primary)]">Intensidade</label>
          <Input placeholder="Ex.: Moderada alta" {...form.register(`sessions.${sessionIndex}.intensity`)} />
          <FieldError message={sessionErrors?.intensity?.message} />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-[var(--fitai-text-primary)]">Exercicios</h4>
          <Button
            disabled={exercises.fields.length >= 12}
            onClick={() => exercises.append(createEmptyExercise())}
            type="button"
            variant="secondary"
          >
            <Plus className="size-4" />
            Exercicio
          </Button>
        </div>

        {exercises.fields.map((field, exerciseIndex) => {
          const exerciseErrors = sessionErrors?.exercises?.[exerciseIndex];

          return (
            <div
              key={field.id}
              className="rounded-xl border border-[var(--fitai-border)] bg-[rgba(255,255,255,0.02)] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--fitai-text-secondary)]">
                  Exercicio {exerciseIndex + 1}
                </p>
                <Button
                  aria-label={`Remover exercicio ${exerciseIndex + 1}`}
                  disabled={exercises.fields.length === 1}
                  onClick={() => exercises.remove(exerciseIndex)}
                  type="button"
                  variant="ghost"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-[var(--fitai-text-primary)]">Nome</label>
                  <Input
                    placeholder="Ex.: Agachamento livre"
                    {...form.register(`sessions.${sessionIndex}.exercises.${exerciseIndex}.name`)}
                  />
                  <FieldError message={exerciseErrors?.name?.message} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--fitai-text-primary)]">Series</label>
                  <Input
                    placeholder="Ex.: 4"
                    {...form.register(`sessions.${sessionIndex}.exercises.${exerciseIndex}.setsDescription`)}
                  />
                  <FieldError message={exerciseErrors?.setsDescription?.message} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--fitai-text-primary)]">Repeticoes</label>
                  <Input
                    placeholder="Ex.: 8-10"
                    {...form.register(`sessions.${sessionIndex}.exercises.${exerciseIndex}.repsDescription`)}
                  />
                  <FieldError message={exerciseErrors?.repsDescription?.message} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--fitai-text-primary)]">Descanso (s)</label>
                  <Input
                    min={0}
                    max={600}
                    type="number"
                    {...form.register(`sessions.${sessionIndex}.exercises.${exerciseIndex}.restSeconds`, {
                      valueAsNumber: true
                    })}
                  />
                  <FieldError message={exerciseErrors?.restSeconds?.message} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--fitai-text-primary)]">Carga</label>
                  <Input
                    placeholder="Ex.: RPE 7 ou 20 kg"
                    {...form.register(`sessions.${sessionIndex}.exercises.${exerciseIndex}.loadSuggestion`)}
                  />
                  <FieldError message={exerciseErrors?.loadSuggestion?.message} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-[var(--fitai-text-primary)]">Observacoes</label>
                  <Textarea
                    placeholder="Ex.: controlar a descida, evitar falha na ultima serie..."
                    {...form.register(`sessions.${sessionIndex}.exercises.${exerciseIndex}.executionNotes`)}
                  />
                  <FieldError message={exerciseErrors?.executionNotes?.message} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WorkoutEditorDialog({
  open,
  onOpenChange,
  mode,
  plan,
  initialObjective,
  onSaved
}: WorkoutEditorDialogProps) {
  const queryClient = useQueryClient();
  const objective = mode === "edit" && plan ? getObjectiveByGoal(plan.goal) : initialObjective ?? WORKOUT_OBJECTIVES[1];

  const form = useForm<WorkoutEditorValues>({
    resolver: zodResolver(workoutEditorSchema),
    defaultValues: createDefaultValues(mode, plan, objective)
  });

  const sessions = useFieldArray({ control: form.control, name: "sessions" });

  // Recarrega os valores quando abre o dialog ou troca o treino editado.
  useEffect(() => {
    if (open) {
      form.reset(createDefaultValues(mode, plan, objective));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, plan?.id]);

  const selectedGoal = form.watch("goal");

  const mutation = useMutation({
    mutationFn: async (values: WorkoutEditorValues) => {
      if (mode === "edit" && plan) {
        await updateWorkoutPlan(plan.id, {
          title: values.title,
          goal: values.goal,
          sessions: values.sessions.map(toSessionInput)
        });
        return;
      }

      // Criacao manual: um treino comeca com um unico dia.
      await createManualWorkout({
        title: values.title,
        goal: values.goal,
        session: toSessionInput(values.sessions[0])
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
      void queryClient.invalidateQueries({ queryKey: ["workout-overview"] });
      onSaved();
      onOpenChange(false);
    }
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));
  const allowMultipleSessions = mode === "edit";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "edit" ? "Editar treino" : "Novo treino manual"}
      description={
        mode === "edit"
          ? "Ajuste titulo, foco, dias e exercicios. As alteracoes substituem o conteudo atual do treino."
          : "Monte seu treino com data, intensidade e exercicios. Ele fica salvo na sua lista."
      }
      className="max-w-2xl"
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-1">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--fitai-text-primary)]">Titulo do treino</label>
              <Input placeholder="Ex.: Plano de hipertrofia da semana" {...form.register("title")} />
              <FieldError message={form.formState.errors.title?.message} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--fitai-text-primary)]">Foco</label>
              <Input placeholder="Ex.: HYPERTROPHY" {...form.register("goal")} />
              <div className="flex flex-wrap gap-2 pt-1">
                {WORKOUT_OBJECTIVES.map((item) => {
                  const isSelected = selectedGoal?.trim().toUpperCase() === item.manualGoal;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => form.setValue("goal", item.manualGoal, { shouldValidate: true })}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                        isSelected
                          ? "border-transparent bg-white text-[var(--fitai-bg-shell)]"
                          : "border-[var(--fitai-border-strong)] text-[var(--fitai-text-secondary)] hover:text-[var(--fitai-text-primary)]"
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <FieldError message={form.formState.errors.goal?.message} />
            </div>
          </div>

          {sessions.fields.map((field, index) => (
            <SessionFields
              key={field.id}
              form={form}
              sessionIndex={index}
              allowRemove={allowMultipleSessions && sessions.fields.length > 1}
              onRemove={() => sessions.remove(index)}
            />
          ))}

          {allowMultipleSessions ? (
            <Button
              disabled={sessions.fields.length >= 7}
              onClick={() =>
                sessions.append({
                  title: `Dia ${sessions.fields.length + 1}`,
                  scheduledDate: getTodayInputValue(),
                  estimatedDurationMinutes: 50,
                  intensity: objective.recommendedIntensity,
                  exercises: [createEmptyExercise()]
                })
              }
              type="button"
              variant="secondary"
            >
              <Plus className="size-4" />
              Adicionar dia
            </Button>
          ) : null}
        </div>

        {mutation.isError ? (
          <p className="flex items-center gap-2 rounded-xl border border-[rgba(255,107,107,0.24)] bg-[rgba(255,107,107,0.08)] px-3 py-2 text-sm text-[var(--fitai-danger)]">
            <AlertCircle className="size-4 shrink-0" />
            {(mutation.error as Error).message}
          </p>
        ) : null}

        <div className="flex items-center justify-end gap-3 border-t border-[var(--fitai-border)] pt-4">
          <Button onClick={() => onOpenChange(false)} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button disabled={mutation.isPending} type="submit">
            {mutation.isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
            {mode === "edit" ? "Salvar alteracoes" : "Salvar treino"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
