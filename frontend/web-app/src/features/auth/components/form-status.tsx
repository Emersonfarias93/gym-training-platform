import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";

type FormStatusProps = {
  message: string;
  tone: "error" | "loading" | "success";
};

const toneMap = {
  error: {
    icon: AlertCircle,
    className:
      "border-[rgba(255,107,107,0.18)] bg-[rgba(255,107,107,0.08)] text-[var(--fitai-danger)]"
  },
  loading: {
    icon: LoaderCircle,
    className:
      "border-[rgba(79,124,255,0.18)] bg-[rgba(79,124,255,0.08)] text-[var(--fitai-primary)]"
  },
  success: {
    icon: CheckCircle2,
    className:
      "border-[rgba(0,208,132,0.18)] bg-[rgba(0,208,132,0.08)] text-[var(--fitai-success)]"
  }
} as const;

export function FormStatus({ message, tone }: FormStatusProps) {
  const { className, icon: Icon } = toneMap[tone];

  return (
    <div
      aria-live="polite"
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${className}`}
      role={tone === "error" ? "alert" : "status"}
    >
      <Icon className={`mt-0.5 size-4 shrink-0 ${tone === "loading" ? "animate-spin" : ""}`} />
      <span>{message}</span>
    </div>
  );
}
