import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--fitai-border)] bg-[rgba(79,124,255,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fitai-primary)]",
        className
      )}
      {...props}
    />
  );
}
