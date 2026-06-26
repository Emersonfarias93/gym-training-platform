import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

type StackedListCardProps = {
  title: string;
  description: string;
  items: {
    id?: string | number;
    title: string;
    subtitle: string;
    meta: string;
    tone?: "primary" | "success" | "warning" | "purple" | "danger";
  }[];
  footer?: ReactNode;
};

const toneClassMap = {
  primary: "border-[rgba(79,124,255,0.22)] bg-[rgba(79,124,255,0.10)] text-[var(--fitai-primary)]",
  success: "border-[rgba(0,208,132,0.18)] bg-[rgba(0,208,132,0.10)] text-[var(--fitai-success)]",
  warning: "border-[rgba(255,159,67,0.20)] bg-[rgba(255,159,67,0.10)] text-[var(--fitai-warning)]",
  purple: "border-[rgba(155,89,255,0.22)] bg-[rgba(155,89,255,0.10)] text-[var(--fitai-purple)]",
  danger: "border-[rgba(255,107,107,0.22)] bg-[rgba(255,107,107,0.10)] text-[var(--fitai-danger)]"
};

function getStackedListItemKey(item: StackedListCardProps["items"][number], index: number) {
  return item.id ?? `${item.title}-${item.subtitle}-${item.meta}-${index}`;
}

export function StackedListCard({
  title,
  description,
  items,
  footer
}: StackedListCardProps) {
  return (
    <Card className="p-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--fitai-text-primary)]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">{description}</p>
      </div>
      <div className="mt-6 space-y-3">
        {items.map((item, index) => (
          <div
            key={getStackedListItemKey(item, index)}
            className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-[var(--fitai-text-primary)]">{item.title}</p>
                <p className="mt-1 text-sm text-[var(--fitai-text-secondary)]">{item.subtitle}</p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${toneClassMap[item.tone ?? "primary"]}`}
              >
                {item.meta}
              </span>
            </div>
          </div>
        ))}
      </div>
      {footer ? <div className="mt-5">{footer}</div> : null}
    </Card>
  );
}
