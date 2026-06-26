import { CalendarDays, Clock3, MapPinned, Sparkles } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { OverviewCard } from "@/features/shared/components/overview-card";
import { StackedListCard } from "@/features/shared/components/stacked-list-card";

const agenda = [
  { title: "Check-in presencial", subtitle: "Marina Silva · Sala 02", meta: "09:00", tone: "primary" as const },
  { title: "Avaliacao de mobilidade", subtitle: "Pedro Lima · Studio", meta: "11:30", tone: "warning" as const },
  { title: "Consulta nutricional", subtitle: "Julia Costa · Online", meta: "16:00", tone: "success" as const }
];

export function SchedulePage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Agenda"
        title="Grade inteligente de compromissos e capacidade"
        description="Visualizacao pensada para filtrar sessoes do dia sem perder contexto da rotina."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard title="Eventos hoje" value="14" helper="ocupacao de 78% da agenda" icon={CalendarDays} />
        <OverviewCard title="Slots livres" value="05" helper="janelas para encaixe rapido" icon={Clock3} />
        <OverviewCard title="Locais" value="03" helper="distribuicao entre studio e online" icon={MapPinned} />
        <OverviewCard title="Plano ativo" value="IA" helper="recursos avancados liberados" icon={Sparkles} />
      </section>

      <StackedListCard
        title="Compromissos do dia"
        description="Sequencia priorizada para leitura rapida dos compromissos do usuario."
        items={agenda}
      />
    </div>
  );
}
