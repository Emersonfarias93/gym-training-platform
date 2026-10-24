import Link from "next/link";

import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WorkoutExerciseProgress } from "@/types/workout";

type CurrentSessionCardProps = {
  exercises: WorkoutExerciseProgress[];
  isLoading: boolean;
  isError?: boolean;
};

export function CurrentSessionCard({ exercises, isLoading, isError = false }: CurrentSessionCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[var(--fitai-text-primary)]">Sua sessão atual</h3>
          <p className="mt-1 text-sm text-[var(--fitai-text-secondary)]">
            Os exercícios do treino escolhido para sua rotina.
          </p>
        </div>
        <Link className={cn(buttonVariants({ variant: "secondary", size: "sm" }))} href="/?view=workouts">
          Ver treinos
        </Link>
      </div>

      {isError ? <p className="mt-6 rounded-lg bg-[var(--fitai-surface-elevated)] p-5 text-sm leading-6 text-[var(--fitai-text-secondary)]">Sua sessão está indisponível no momento. Tente carregar os dados novamente.</p> : isLoading ? (
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)]"
            />
          ))}
        </div>
      ) : exercises.length > 0 ? (
        <div className="mt-6 space-y-4">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-4"
            >
              <p className="font-medium text-[var(--fitai-text-primary)]">{exercise.name}</p>
              <p className="mt-1 text-sm text-[var(--fitai-text-secondary)]">{exercise.sets}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-5 text-sm leading-6 text-[var(--fitai-text-secondary)]">
          Você ainda não escolheu um treino ativo. Em Meus treinos, crie ou escolha uma ficha para acompanhar a sessão
          aqui.
        </div>
      )}
    </Card>
  );
}
