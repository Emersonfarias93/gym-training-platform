import { CalendarDays, Clock3, MapPinned, Users2 } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { OverviewCard } from "@/features/shared/components/overview-card";
import { StackedListCard } from "@/features/shared/components/stacked-list-card";

const agenda = [
  { title: "Check-in presencial", subtitle: "Marina Silva · Sala 02", meta: "09:00", accent: "#86efac" },
  { title: "Avaliacao de mobilidade", subtitle: "Pedro Lima · Studio", meta: "11:30", accent: "#67e8f9" },
  { title: "Consulta nutricional", subtitle: "Julia Costa · Online", meta: "16:00", accent: "#fcd34d" }
];

export function SchedulePage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Agenda"
        title="Grade inteligente de compromissos e capacidade"
        description="Visualizacao pensada para filtrar sessoes do dia sem perder contexto de equipe."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard title="Eventos hoje" value="14" helper="ocupacao de 78% da agenda" icon={CalendarDays} />
        <OverviewCard title="Slots livres" value="05" helper="janelas para encaixe rapido" icon={Clock3} />
        <OverviewCard title="Locais" value="03" helper="distribuicao entre studio e online" icon={MapPinned} />
        <OverviewCard title="Equipe" value="07" helper="treinadores escalados" icon={Users2} />
      </section>

      <StackedListCard
        title="Compromissos do dia"
        description="Sequencia priorizada para leitura rapida e operacao da recepcao ou coach."
        items={agenda}
      />
    </div>
  );
}
