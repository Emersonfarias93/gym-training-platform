import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

type OverviewCardProps = {
  title: string;
  value: string;
  helper: string;
  icon: LucideIcon;
};

export function OverviewCard({ title, value, helper, icon: Icon }: OverviewCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--muted-foreground)]">{title}</p>
          <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-black/20 p-3 text-emerald-300">
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-4 text-sm text-[var(--muted-foreground)]">{helper}</p>
    </Card>
  );
}
