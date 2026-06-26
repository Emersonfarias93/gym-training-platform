import { BellDot, ChevronDown, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pageIntro } from "@/features/navigation/config";
import { cn } from "@/lib/utils";
import type { AppView } from "@/types/dashboard";

type TopbarProps = {
  activeView: AppView;
};

export function Topbar({ activeView }: TopbarProps) {
  const intro = pageIntro[activeView];

  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b border-[var(--fitai-border-subtle)] bg-[var(--fitai-bg-page)] px-4 py-5 md:px-8",
        activeView === "ai-coach" && "hidden md:flex"
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Badge>
            {intro.eyebrow}
          </Badge>
          <h1 className="mt-3 text-2xl font-semibold tracking-normal text-[var(--fitai-text-primary)] md:text-3xl">
            {intro.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--fitai-text-secondary)]">
            {intro.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary">
            <BellDot className="size-4" />
            Alertas
          </Button>
          <Button>
            <Sparkles className="size-4" />
            Nova estrategia
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {intro.filters.map((item, index) => (
          <button
            key={item}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              index === 0
                ? "bg-[var(--fitai-primary)] text-white"
                : "border border-[var(--fitai-border)] bg-[var(--fitai-surface)] text-[var(--fitai-text-secondary)] hover:text-[var(--fitai-text-primary)]"
            }`}
          >
            {item}
          </button>
        ))}
        <button className="ml-auto inline-flex items-center gap-2 rounded-full border border-[var(--fitai-border)] bg-[var(--fitai-surface)] px-4 py-2 text-sm text-[var(--fitai-text-secondary)]">
          Filtrar por plano
          <ChevronDown className="size-4" />
        </button>
      </div>
    </header>
  );
}
