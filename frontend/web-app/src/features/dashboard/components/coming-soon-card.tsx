import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type ComingSoonCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function ComingSoonCard({ icon: Icon, title, description }: ComingSoonCardProps) {
  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-3 text-[var(--fitai-text-secondary)]">
          <Icon className="size-5" />
        </span>
        <Badge className="border-[var(--fitai-border)] bg-[var(--fitai-surface-secondary)] text-[var(--fitai-text-secondary)]">
          Em breve
        </Badge>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--fitai-text-primary)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">{description}</p>
    </Card>
  );
}
