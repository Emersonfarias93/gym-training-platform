import { Flame, Salad, Waves } from "lucide-react";

import { Card } from "@/components/ui/card";

const stats = [
  { label: "Calorias", value: "2.140", icon: Flame, tone: "text-rose-300" },
  { label: "Proteina", value: "164g", icon: Salad, tone: "text-emerald-300" },
  { label: "Agua", value: "2.8L", icon: Waves, tone: "text-cyan-300" }
];

export function NutritionCard() {
  return (
    <Card className="p-6">
      <p className="text-lg font-semibold text-white">Resumo nutricional</p>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
        Consumo do dia sincronizado com sua meta de composicao corporal.
      </p>
      <div className="mt-6 grid gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="flex items-center justify-between rounded-[22px] border border-white/8 bg-white/4 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-black/30 p-3">
                  <Icon className={`size-5 ${stat.tone}`} />
                </div>
                <span className="text-sm text-[var(--muted-foreground)]">{stat.label}</span>
              </div>
              <span className="text-lg font-semibold text-white">{stat.value}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
