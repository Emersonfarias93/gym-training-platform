import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type FocusCardProps = {
  items: Array<{
    label: string;
    icon: LucideIcon;
    progress: number;
    tone: "primary" | "success" | "warning";
  }>;
};

const toneMap = {
  primary: "text-[var(--fitai-primary)]",
  success: "text-[var(--fitai-success)]",
  warning: "text-[var(--fitai-warning)]"
};

const indicatorMap = {
  primary: "bg-[var(--fitai-primary)]",
  success: "bg-[var(--fitai-success)]",
  warning: "bg-[var(--fitai-warning)]"
};

export function FocusCard({ items }: FocusCardProps) {
  return (
    <Card className="p-6">
      <p className="text-lg font-semibold text-[var(--fitai-text-primary)]">Areas de foco</p>
      <p className="mt-1 text-sm text-[var(--fitai-text-secondary)]">
        Metas calibradas pelo seu historico e disponibilidade semanal.
      </p>
      <div className="mt-6 space-y-5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-[var(--fitai-text-primary)]">
                  <Icon className={cn("size-4", toneMap[item.tone])} />
                  {item.label}
                </div>
                <span className="text-[var(--fitai-text-secondary)]">{item.progress}%</span>
              </div>
              <Progress
                value={item.progress}
                indicatorClassName={indicatorMap[item.tone]}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
