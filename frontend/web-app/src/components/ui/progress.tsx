import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number;
  className?: string;
  indicatorClassName?: string;
};

export function Progress({
  value,
  className,
  indicatorClassName
}: ProgressProps) {
  return (
    <div
      className={cn(
        "h-2 overflow-hidden rounded-full bg-[var(--fitai-surface-secondary)]",
        className
      )}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={value}
      role="progressbar"
    >
      <div
        className={cn(
          "h-full rounded-full fitai-progress-gradient",
          indicatorClassName
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
