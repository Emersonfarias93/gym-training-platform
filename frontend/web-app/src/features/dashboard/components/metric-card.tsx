import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Metric } from "@/types/dashboard";

type MetricCardProps = {
  metric: Metric;
};

export function MetricCard({ metric }: MetricCardProps) {
  const isPositive = metric.trend === "up";
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="p-5">
      <p className="text-sm text-[var(--muted-foreground)]">{metric.label}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-semibold tracking-tight text-white">
            {metric.value}
          </p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {metric.helper}
          </p>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium",
            isPositive
              ? "bg-emerald-500/14 text-emerald-300"
              : "bg-amber-500/14 text-amber-300"
          )}
        >
          <TrendIcon className="size-4" />
          {metric.delta}
        </div>
      </div>
    </Card>
  );
}
