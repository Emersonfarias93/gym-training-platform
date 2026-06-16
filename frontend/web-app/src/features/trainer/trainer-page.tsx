import { BriefcaseBusiness, ChartColumnBig, ShieldCheck, UsersRound } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { OverviewCard } from "@/features/shared/components/overview-card";
import { StackedListCard } from "@/features/shared/components/stacked-list-card";

const students = [
  { title: "Julia Mendes", subtitle: "Aderencia alta · plano premium", meta: "Estavel", accent: "#86efac" },
  { title: "Caio Ribeiro", subtitle: "Queda de frequencia nos ultimos 7 dias", meta: "Atencao", accent: "#fcd34d" },
  { title: "Ana Torres", subtitle: "Nova fase de ganho de massa", meta: "Oportunidade", accent: "#67e8f9" }
];

export function TrainerPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Coach Console"
        title="Operacao do treinador com foco em alunos e prescricao"
        description="Combine visao de carteira, risco de churn e espaco para acoes taticas do time."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard title="Alunos ativos" value="48" helper="7 em onboarding" icon={UsersRound} />
        <OverviewCard title="Receita MRR" value="R$ 18.4k" helper="carteira recorrente atual" icon={BriefcaseBusiness} />
        <OverviewCard title="Retencao" value="94%" helper="indice de renovacao mensal" icon={ShieldCheck} />
        <OverviewCard title="Planos ajustados" value="13" helper="prescricoes revisadas hoje" icon={ChartColumnBig} />
      </section>

      <StackedListCard
        title="Leitura da carteira"
        description="Lista dos alunos mais relevantes para atuacao imediata."
        items={students}
      />
    </div>
  );
}
