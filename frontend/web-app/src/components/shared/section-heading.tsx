import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? <Badge>{eyebrow}</Badge> : null}
        <div>
          <h2 className="text-xl font-semibold text-white md:text-2xl">{title}</h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  );
}
