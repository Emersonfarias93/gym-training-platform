import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

type StackedListCardProps = {
  title: string;
  description: string;
  items: {
    title: string;
    subtitle: string;
    meta: string;
    accent?: string;
  }[];
  footer?: ReactNode;
};

export function StackedListCard({
  title,
  description,
  items,
  footer
}: StackedListCardProps) {
  return (
    <Card className="p-6">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
      </div>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div
            key={`${item.title}-${item.meta}`}
            className="rounded-[22px] border border-white/8 bg-black/20 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-white">{item.title}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{item.subtitle}</p>
              </div>
              <span
                className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em]"
                style={{
                  borderColor: item.accent ?? "rgba(255,255,255,0.12)",
                  color: item.accent ?? "rgba(255,255,255,0.7)"
                }}
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
