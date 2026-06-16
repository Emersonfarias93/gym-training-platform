import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fitai-bg-page)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "fitai-primary-gradient text-white shadow-[0_18px_38px_-22px_rgba(79,124,255,0.95)] hover:bg-[var(--fitai-primary-hover)] hover:brightness-105",
        secondary:
          "border border-[var(--fitai-border)] bg-[var(--fitai-surface-secondary)] text-[var(--fitai-text-primary)] hover:border-[var(--fitai-border-strong)] hover:bg-[var(--fitai-surface-elevated)]",
        ghost:
          "text-[var(--fitai-text-secondary)] hover:bg-[rgba(79,124,255,0.07)] hover:text-[var(--fitai-text-primary)]"
      },
      size: {
        sm: "h-10 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-6"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  )
);

Button.displayName = "Button";

export { Button, buttonVariants };
