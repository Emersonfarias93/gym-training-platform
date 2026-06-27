import { Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { UpgradePlanButton } from "@/features/checkout/upgrade-plan-button";

type LockedFeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  perks: string[];
  ctaLabel?: string;
};

export function LockedFeatureCard({ icon: Icon, title, description, perks, ctaLabel }: LockedFeatureCardProps) {
  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-2xl bg-[rgba(79,124,255,0.10)] p-3 text-[var(--fitai-primary)]">
          <Icon className="size-5" />
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--fitai-border)] bg-[var(--fitai-surface-secondary)] px-3 py-1 text-xs font-semibold text-[var(--fitai-text-secondary)]">
          <Lock className="size-3" />
          Plano ativo
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--fitai-text-primary)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">{description}</p>
      <ul className="mt-4 space-y-2">
        {perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-sm text-[var(--fitai-text-secondary)]">
            <span className="size-1.5 rounded-full bg-[var(--fitai-primary)]" />
            {perk}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <UpgradePlanButton withIcon className="w-full" label={ctaLabel ?? "Ativar plano"} />
      </div>
    </Card>
  );
}
