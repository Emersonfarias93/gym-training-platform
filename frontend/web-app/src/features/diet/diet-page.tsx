import { Apple, ChartPie, Soup, UtensilsCrossed } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { OverviewCard } from "@/features/shared/components/overview-card";
import { StackedListCard } from "@/features/shared/components/stacked-list-card";

const meals = [
  { title: "Cafe da manha", subtitle: "32g prot · 48g carb · 12g fat", meta: "612 kcal", accent: "#86efac" },
  { title: "Almoco", subtitle: "46g prot · 65g carb · 18g fat", meta: "780 kcal", accent: "#67e8f9" },
  { title: "Jantar", subtitle: "38g prot · 40g carb · 14g fat", meta: "590 kcal", accent: "#fcd34d" }
];

export function DietPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Nutrition Overview"
        title="Leitura diaria dos macros e das refeicoes"
        description="Ajuste facilmente a distribuicao nutricional e identifique excesso ou falta de consistencia."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard title="Calorias" value="2.184" helper="83% da meta do dia" icon={UtensilsCrossed} />
        <OverviewCard title="Proteina" value="164g" helper="meta superada em 6g" icon={Apple} />
        <OverviewCard title="Carboidrato" value="228g" helper="janela pre treino consistente" icon={ChartPie} />
        <OverviewCard title="Agua" value="2.9L" helper="hidratação em zona segura" icon={Soup} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)]">
        <StackedListCard
          title="Refeicoes planejadas"
          description="Sequencia alimentar com densidade visual enxuta para consulta rapida."
          items={meals}
        />
        <div className="rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_55%),rgba(255,255,255,0.04)] p-6">
          <h3 className="text-lg font-semibold text-white">Distribuicao de macros</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Proteina", value: "30%", tone: "from-emerald-400 to-emerald-200" },
              { label: "Carbo", value: "44%", tone: "from-cyan-400 to-cyan-200" },
              { label: "Gordura", value: "26%", tone: "from-amber-400 to-amber-200" }
            ].map((item) => (
              <div key={item.label} className="rounded-[22px] border border-white/8 bg-black/20 p-4 text-center">
                <div className={`mx-auto grid size-24 place-items-center rounded-full bg-gradient-to-br ${item.tone} text-xl font-semibold text-black`}>
                  {item.value}
                </div>
                <p className="mt-4 text-sm text-[var(--muted-foreground)]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
