import { ActivitySquare, CalendarClock, ClipboardList, HeartPulse } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { OverviewCard } from "@/features/shared/components/overview-card";
import { StackedListCard } from "@/features/shared/components/stacked-list-card";

const assessments = [
  { title: "Bioimpedancia", subtitle: "Atualizada ha 6 dias", meta: "Concluida", accent: "#86efac" },
  { title: "Teste de VO2", subtitle: "Historico de condicionamento", meta: "Revisar", accent: "#fcd34d" },
  { title: "Mobilidade global", subtitle: "Abertura de ombro e quadril", meta: "Agendada", accent: "#67e8f9" }
];

export function AssessmentsPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Assessment Flow"
        title="Timeline das avaliacoes com foco em comparacao e risco"
        description="Organize checkpoints clinicos e esportivos com contexto de decisao em poucos blocos."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard title="Pendentes" value="04" helper="2 precisam de atencao hoje" icon={ClipboardList} />
        <OverviewCard title="Frequencia" value="22 dias" helper="ciclo medio entre avaliacoes" icon={CalendarClock} />
        <OverviewCard title="Score cardiaco" value="84" helper="estabilidade nos ultimos exames" icon={HeartPulse} />
        <OverviewCard title="Movimento" value="88%" helper="boa amplitude geral" icon={ActivitySquare} />
      </section>

      <StackedListCard
        title="Historico recente"
        description="Lista com status e contexto para triagem rapida."
        items={assessments}
      />
    </div>
  );
}
