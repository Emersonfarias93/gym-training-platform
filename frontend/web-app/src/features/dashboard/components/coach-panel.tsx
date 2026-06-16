import { MessageSquareText, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type CoachPanelProps = {
  insights: Array<{ title: string; body: string }>;
};

export function CoachPanel({ insights }: CoachPanelProps) {
  return (
    <Card className="relative overflow-hidden p-6">
      <div className="absolute inset-x-10 top-0 h-32 rounded-full bg-[rgba(79,124,255,0.10)] blur-3xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(79,124,255,0.22)] bg-[rgba(79,124,255,0.10)] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[var(--fitai-primary)]">
            <Sparkles className="size-3.5" />
            AI Coach
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-[var(--fitai-text-primary)]">
            Recomendacoes adaptativas em tempo real
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--fitai-text-secondary)]">
            O motor FitAI correlaciona treinos, sono, agenda e nutricao para sugerir o proximo melhor passo.
          </p>
        </div>
        <Button className="hidden md:inline-flex">
          <MessageSquareText className="size-4" />
          Abrir conversa
        </Button>
      </div>
      <div className="relative mt-6 grid gap-4">
        {insights.map((insight) => (
          <div
            key={insight.title}
            className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-4"
          >
            <p className="font-medium text-[var(--fitai-text-primary)]">{insight.title}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">
              {insight.body}
            </p>
          </div>
        ))}
      </div>
      <Button className="relative mt-5 w-full md:hidden">
        <MessageSquareText className="size-4" />
        Abrir conversa
      </Button>
    </Card>
  );
}
