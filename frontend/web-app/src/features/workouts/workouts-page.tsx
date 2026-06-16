import { Clock3, Dumbbell, Flame, Layers3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SectionHeading } from "@/components/shared/section-heading";
import { OverviewCard } from "@/features/shared/components/overview-card";
import { StackedListCard } from "@/features/shared/components/stacked-list-card";

const blocks = [
  { title: "Push Strength", subtitle: "6 exercicios · descanso 90s", meta: "Hoje", accent: "#86efac" },
  { title: "Posterior Chain", subtitle: "5 exercicios · foco em carga", meta: "Amanha", accent: "#67e8f9" },
  { title: "Recovery Flow", subtitle: "Mobilidade e respiracao", meta: "Sabado", accent: "#fcd34d" }
];

const exercises = [
  { name: "Bench Press", sets: "4 x 6", progress: 84 },
  { name: "Incline DB Press", sets: "3 x 10", progress: 71 },
  { name: "Cable Fly", sets: "3 x 12", progress: 58 }
];

export function WorkoutsPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Training Blocks"
        title="Visao operacional dos treinos ativos"
        description="Ajuste estrutura, volume e descanso com leitura rapida por bloco e por exercicio."
        action={<Button>Nova ficha</Button>}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard title="Sessoes ativas" value="12" helper="4 atletas em execucao hoje" icon={Dumbbell} />
        <OverviewCard title="Volume semanal" value="18.4k" helper="tonelagem consolidada" icon={Layers3} />
        <OverviewCard title="Tempo medio" value="58 min" helper="janela ideal mantida" icon={Clock3} />
        <OverviewCard title="Intensidade" value="8.1/10" helper="RPE medio da carteira" icon={Flame} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <StackedListCard
          title="Blocos programados"
          description="Grade dos proximos treinos organizada por dia e tipo de estimulo."
          items={blocks}
        />
        <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6">
          <h3 className="text-lg font-semibold text-white">Execucao do treino atual</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            Painel compacto para acompanhar a aderencia do atleta durante a sessao.
          </p>
          <div className="mt-6 space-y-4">
            {exercises.map((exercise) => (
              <div key={exercise.name} className="rounded-[22px] border border-white/8 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{exercise.name}</p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{exercise.sets}</p>
                  </div>
                  <span className="text-sm text-emerald-300">{exercise.progress}%</span>
                </div>
                <Progress value={exercise.progress} className="mt-4 h-2.5" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
