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
        "h-2 overflow-hidden rounded-full bg-white/8",
        className
      )}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={value}
      role="progressbar"
    >
      <div
        className={cn(
          "h-full rounded-full bg-[linear-gradient(90deg,var(--primary),#7bf1b0)]",
          indicatorClassName
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
