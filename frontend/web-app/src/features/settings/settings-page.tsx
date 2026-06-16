import { BellRing, LockKeyhole, SlidersHorizontal, Workflow } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { SectionHeading } from "@/components/shared/section-heading";
import { OverviewCard } from "@/features/shared/components/overview-card";

const controls = [
  { label: "Notificacoes", value: 78 },
  { label: "Automacoes", value: 54 },
  { label: "Permissoes", value: 91 }
];

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Workspace Controls"
        title="Preferencias do produto, equipe e automacoes"
        description="Camada de configuracao desenhada para parecer premium sem perder objetividade."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard title="Alertas ativos" value="18" helper="monitoramentos habilitados" icon={BellRing} />
        <OverviewCard title="Regras IA" value="06" helper="fluxos automaticos configurados" icon={Workflow} />
        <OverviewCard title="Seguranca" value="2FA On" helper="time protegido por dupla verificacao" icon={LockKeyhole} />
        <OverviewCard title="Customizacao" value="Avancada" helper="tema e operacao personalizados" icon={SlidersHorizontal} />
      </section>

      <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6">
        <h3 className="text-lg font-semibold text-white">Saude da configuracao</h3>
        <div className="mt-6 space-y-5">
          {controls.map((control) => (
            <div key={control.label}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-white">{control.label}</p>
                <span className="text-sm text-[var(--muted-foreground)]">{control.value}%</span>
              </div>
              <Progress value={control.value} className="mt-3 h-2.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
