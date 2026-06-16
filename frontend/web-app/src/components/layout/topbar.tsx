import { BellDot, ChevronDown, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pageIntro } from "@/features/navigation/config";
import type { AppView } from "@/types/dashboard";

type TopbarProps = {
  activeView: AppView;
};

export function Topbar({ activeView }: TopbarProps) {
  const intro = pageIntro[activeView];

  return (
    <header className="flex flex-col gap-4 border-b border-white/6 px-4 py-5 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Badge className="border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
            {intro.eyebrow}
          </Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {intro.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
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
                ? "bg-white text-black"
                : "border border-white/8 bg-white/4 text-[var(--muted-foreground)] hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
        <button className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-4 py-2 text-sm text-[var(--muted-foreground)]">
          Filtrar por atleta
          <ChevronDown className="size-4" />
        </button>
      </div>
    </header>
  );
}
