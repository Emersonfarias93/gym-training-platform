import { Card } from "@/components/ui/card";

type ActivityChartProps = {
  values: Array<{ day: string; percent: number }>;
};

export function ActivityChart({ values }: ActivityChartProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-white">Carga semanal</p>
          <p className="text-sm text-[var(--muted-foreground)]">
            Distribuicao ideal entre intensidade e recuperacao.
          </p>
        </div>
        <div className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
          4 zonas otimizadas
        </div>
      </div>
      <div className="mt-8 grid grid-cols-7 items-end gap-3">
        {values.map((value) => (
          <div key={value.day} className="flex flex-col items-center gap-3">
            <div className="flex h-44 w-full items-end rounded-[20px] bg-white/5 p-2">
              <div
                className="w-full rounded-[14px] bg-[linear-gradient(180deg,rgba(123,241,176,0.95),rgba(19,78,74,0.6))] shadow-[0_12px_24px_-16px_rgba(123,241,176,0.9)]"
                style={{ height: `${value.percent}%` }}
              />
            </div>
            <span className="text-xs text-[var(--muted-foreground)]">
              {value.day}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
