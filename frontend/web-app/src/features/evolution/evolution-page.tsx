import { Camera, ScanLine, TrendingUp, Weight } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { SectionHeading } from "@/components/shared/section-heading";
import { OverviewCard } from "@/features/shared/components/overview-card";

const series = [
  { label: "Peso", value: "78.4 kg", delta: "-2.1 kg", progress: 64 },
  { label: "Gordura corporal", value: "14.8%", delta: "-1.4%", progress: 71 },
  { label: "Massa magra", value: "38.9 kg", delta: "+0.8 kg", progress: 82 }
];

export function EvolutionPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Body Progress"
        title="Historico corporal com comparativos prontos para leitura"
        description="Monitore tendencia, composição e evolução visual do usuario em uma grade premium."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard title="Peso atual" value="78.4 kg" helper="menor marca em 90 dias" icon={Weight} />
        <OverviewCard title="Body fat" value="14.8%" helper="queda consistente no trimestre" icon={TrendingUp} />
        <OverviewCard title="Scan score" value="91/100" helper="qualidade de composicao corporal" icon={ScanLine} />
        <OverviewCard title="Fotos" value="12 pares" helper="biblioteca de progresso ativa" icon={Camera} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface)] p-6">
          <h3 className="text-lg font-semibold text-[var(--fitai-text-primary)]">Tendencias dos indicadores</h3>
          <div className="mt-6 space-y-5">
            {series.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-[var(--fitai-text-primary)]">{item.label}</p>
                    <p className="text-sm text-[var(--fitai-text-secondary)]">{item.value}</p>
                  </div>
                  <span className="text-sm text-[var(--fitai-success)]">{item.delta}</span>
                </div>
                <Progress value={item.progress} className="mt-3 h-2.5" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {["Frente", "Lado"].map((view) => (
            <div
              key={view}
              className="min-h-56 rounded-2xl border border-dashed border-[var(--fitai-border-strong)] bg-[var(--fitai-surface)] p-5"
            >
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--fitai-text-secondary)]">{view}</p>
              <div className="mt-6 flex h-40 items-center justify-center rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] text-sm text-[var(--fitai-text-secondary)]">
                Placeholder de foto de progresso
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
