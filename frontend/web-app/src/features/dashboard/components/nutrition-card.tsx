import { Flame, Salad, Waves } from "lucide-react";

import { Card } from "@/components/ui/card";

const stats = [
  { label: "Calorias", value: "2.140", icon: Flame, tone: "text-[var(--fitai-warning)]" },
  { label: "Proteina", value: "164g", icon: Salad, tone: "text-[var(--fitai-primary)]" },
  { label: "Agua", value: "2.8L", icon: Waves, tone: "text-[var(--fitai-success)]" }
];

export function NutritionCard() {
  return (
    <Card className="p-6">
      <p className="text-lg font-semibold text-[var(--fitai-text-primary)]">Resumo nutricional</p>
      <p className="mt-1 text-sm text-[var(--fitai-text-secondary)]">
        Consumo do dia sincronizado com sua meta de composicao corporal.
      </p>
      <div className="mt-6 grid gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="flex items-center justify-between rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[var(--fitai-surface-secondary)] p-3">
                  <Icon className={`size-5 ${stat.tone}`} />
                </div>
                <span className="text-sm text-[var(--fitai-text-secondary)]">{stat.label}</span>
              </div>
              <span className="text-lg font-semibold text-[var(--fitai-text-primary)]">{stat.value}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
