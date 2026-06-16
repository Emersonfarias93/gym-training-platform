import { Bot, MessageSquareShare, Sparkles, TimerReset } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { OverviewCard } from "@/features/shared/components/overview-card";

const history = [
  {
    role: "AI Coach",
    body: "O atleta sustentou boa recuperacao nos ultimos 10 dias. Recomendo subir carga no supino e reduzir volume de cardio em 8%.",
    tone: "from-emerald-400/20 to-transparent"
  },
  {
    role: "Coach",
    body: "Gerar mensagem resumida para o aluno e criar treino de membros superiores com foco em progressao.",
    tone: "from-cyan-400/20 to-transparent"
  },
  {
    role: "AI Coach",
    body: "Mensagem pronta e ficha sugerida com 6 exercicios. Posso tambem ajustar os macros para preservar recuperacao.",
    tone: "from-emerald-400/20 to-transparent"
  }
];

export function AICoachPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Conversational Layer"
        title="Central de operacao da IA com contexto e historico"
        description="A interface prioriza leitura conversacional, prompts rapidos e feedback visual de processamento."
        action={
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">Resumo diario</Button>
            <Button>Nova estrategia</Button>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard title="Conversas hoje" value="28" helper="tempo medio de resposta 14s" icon={Bot} />
        <OverviewCard title="Prompts salvos" value="12" helper="uso recorrente pela equipe" icon={Sparkles} />
        <OverviewCard title="Mensagens enviadas" value="43" helper="saidas para atletas e coachs" icon={MessageSquareShare} />
        <OverviewCard title="Tempo economizado" value="5.3h" helper="estimativa operacional" icon={TimerReset} />
      </section>

      <div className="rounded-[32px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_42%),rgba(255,255,255,0.04)] p-6 md:p-8">
        <div className="space-y-4">
          {history.map((entry, index) => (
            <div
              key={`${entry.role}-${index}`}
              className={`rounded-[24px] border border-white/8 bg-gradient-to-br ${entry.tone} bg-black/20 p-5`}
            >
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">{entry.role}</p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/90">{entry.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-[24px] border border-white/8 bg-black/20 p-4">
          <div className="flex flex-wrap gap-3">
            {["Gerar treino", "Ajustar macros", "Resumo semanal", "Mensagem para atleta"].map((item) => (
              <button
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-white"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-[20px] border border-white/8 bg-white/4 px-4 py-3 text-sm text-[var(--muted-foreground)]">
            Descreva a acao desejada para o AI Coach...
          </div>
        </div>
      </div>
    </div>
  );
}
