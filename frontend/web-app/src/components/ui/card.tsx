import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface)] shadow-[0_18px_60px_-44px_rgba(0,0,0,0.9)]",
        className
      )}
      {...props}
    />
  );
}
