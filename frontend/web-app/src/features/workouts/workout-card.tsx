"use client";

import {
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flame,
  ListChecks,
  LoaderCircle,
  Pencil,
  Sparkles,
  Trash2
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WorkoutPlanSummary } from "@/types/workout";

type WorkoutCardProps = {
  plan: WorkoutPlanSummary;
  onChoose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  busy?: boolean;
};

function formatShortDate(value: string | null) {
  if (!value) {
    return "Sem data";
  }
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }
  return `${day}/${month}`;
}

function MetaItem({ icon: Icon, label }: { icon: typeof Clock3; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--fitai-text-secondary)]">
      <Icon className="size-3.5 text-[var(--fitai-text-muted)]" />
      {label}
    </span>
  );
}

export function WorkoutCard({ plan, onChoose, onEdit, onDelete, busy }: WorkoutCardProps) {
  const isAi = plan.origin === "AI";
  const durationLabel = plan.estimatedDurationMinutes ? `${plan.estimatedDurationMinutes} min` : "-- min";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-[var(--fitai-surface)] p-5 transition-colors",
        plan.active
          ? "border-[rgba(79,124,255,0.45)] shadow-[0_0_0_1px_rgba(79,124,255,0.25)]"
          : "border-[var(--fitai-border)]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={cn(
                "gap-1.5",
                isAi
                  ? "bg-[rgba(79,124,255,0.10)] text-[var(--fitai-primary)]"
                  : "border-[var(--fitai-border-strong)] bg-[rgba(255,255,255,0.03)] text-[var(--fitai-text-secondary)]"
              )}
            >
              {isAi ? <Sparkles className="size-3" /> : <Dumbbell className="size-3" />}
              {isAi ? "IA" : "Manual"}
            </Badge>
            {plan.active ? (
              <Badge className="gap-1.5 border-[rgba(0,208,132,0.24)] bg-[rgba(0,208,132,0.10)] text-[var(--fitai-success)]">
                <CheckCircle2 className="size-3" />
                Ativo
              </Badge>
            ) : null}
          </div>
          <h3 className="truncate text-lg font-semibold text-[var(--fitai-text-primary)]">{plan.title}</h3>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--fitai-text-muted)]">{plan.goal}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <MetaItem icon={Clock3} label={durationLabel} />
        <MetaItem icon={Flame} label={plan.intensity ?? "Intensidade a definir"} />
        <MetaItem icon={ListChecks} label={`${plan.exerciseCount} exercicios`} />
        <MetaItem icon={Dumbbell} label={`${plan.sessionCount} ${plan.sessionCount === 1 ? "dia" : "dias"}`} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--fitai-border)] pt-4">
        <Button
          className="flex-1 sm:flex-none"
          disabled={busy || plan.active}
          onClick={onChoose}
          size="sm"
          type="button"
        >
          {busy ? <LoaderCircle className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
          {plan.active ? "Em uso" : "Escolher"}
        </Button>
        <Button onClick={onEdit} size="sm" type="button" variant="secondary">
          <Pencil className="size-4" />
          Editar
        </Button>
        <Button
          aria-label={`Excluir ${plan.title}`}
          onClick={onDelete}
          size="sm"
          type="button"
          variant="ghost"
        >
          <Trash2 className="size-4" />
          Excluir
        </Button>
      </div>
    </div>
  );
}
