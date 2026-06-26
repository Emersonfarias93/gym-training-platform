import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface)] px-4 py-3 text-sm text-[var(--fitai-text-primary)] outline-none transition-colors placeholder:text-[var(--fitai-text-muted)] focus-visible:border-[rgba(79,124,255,0.4)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
