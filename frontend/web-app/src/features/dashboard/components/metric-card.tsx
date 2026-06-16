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
      <p className="text-sm text-[var(--fitai-text-secondary)]">{metric.label}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-semibold tracking-normal text-[var(--fitai-text-primary)]">
            {metric.value}
          </p>
          <p className="mt-2 text-sm text-[var(--fitai-text-secondary)]">
            {metric.helper}
          </p>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium",
            isPositive
              ? "bg-[rgba(0,208,132,0.10)] text-[var(--fitai-success)]"
              : "bg-[rgba(255,159,67,0.10)] text-[var(--fitai-warning)]"
          )}
        >
          <TrendIcon className="size-4" />
          {metric.delta}
        </div>
      </div>
    </Card>
  );
}
