import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type FocusCardProps = {
  items: Array<{
    label: string;
    icon: LucideIcon;
    progress: number;
    tone: "emerald" | "cyan" | "amber";
  }>;
};

const toneMap = {
  emerald: "text-emerald-300",
  cyan: "text-cyan-300",
  amber: "text-amber-300"
};

export function FocusCard({ items }: FocusCardProps) {
  return (
    <Card className="p-6">
      <p className="text-lg font-semibold text-white">Areas de foco</p>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
        Metas calibradas pelo seu historico e disponibilidade semanal.
      </p>
      <div className="mt-6 space-y-5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-white">
                  <Icon className={cn("size-4", toneMap[item.tone])} />
                  {item.label}
                </div>
                <span className="text-[var(--muted-foreground)]">{item.progress}%</span>
              </div>
              <Progress
                value={item.progress}
                indicatorClassName={cn(
                  item.tone === "cyan" &&
                    "bg-[linear-gradient(90deg,rgba(34,211,238,1),rgba(14,165,233,0.7))]",
                  item.tone === "amber" &&
                    "bg-[linear-gradient(90deg,rgba(251,191,36,1),rgba(245,158,11,0.7))]"
                )}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
