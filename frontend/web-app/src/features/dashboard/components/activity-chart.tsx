import { Card } from "@/components/ui/card";

type ActivityChartProps = {
  values: Array<{ day: string; percent: number }>;
};

export function ActivityChart({ values }: ActivityChartProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-[var(--fitai-text-primary)]">Carga semanal</p>
          <p className="text-sm text-[var(--fitai-text-secondary)]">
            Distribuicao ideal entre intensidade e recuperacao.
          </p>
        </div>
        <div className="rounded-full border border-[rgba(0,208,132,0.18)] bg-[rgba(0,208,132,0.10)] px-3 py-1 text-xs font-medium text-[var(--fitai-success)]">
          4 zonas otimizadas
        </div>
      </div>
      <div className="mt-8 grid grid-cols-7 items-end gap-3">
        {values.map((value) => (
          <div key={value.day} className="flex flex-col items-center gap-3">
            <div className="flex h-44 w-full items-end rounded-[20px] bg-[var(--fitai-surface-secondary)] p-2">
              <div
                className="w-full rounded-[14px] bg-[linear-gradient(180deg,var(--fitai-primary),rgba(79,124,255,0.45))] shadow-[0_12px_24px_-16px_rgba(79,124,255,0.9)]"
                style={{ height: `${value.percent}%` }}
              />
            </div>
            <span className="text-xs text-[var(--fitai-text-secondary)]">
              {value.day}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
