import { MessageSquareText, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type CoachPanelProps = {
  insights: Array<{ title: string; body: string }>;
};

export function CoachPanel({ insights }: CoachPanelProps) {
  return (
    <Card className="relative overflow-hidden p-6">
      <div className="absolute inset-x-10 top-0 h-32 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
            <Sparkles className="size-3.5" />
            AI Coach
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-white">
            Recomendacoes adaptativas em tempo real
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
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
            className="rounded-[24px] border border-white/8 bg-black/20 p-4"
          >
            <p className="font-medium text-white">{insight.title}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
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
