import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium tracking-[0.18em] text-[var(--muted-foreground)] uppercase",
        className
      )}
      {...props}
    />
  );
}
