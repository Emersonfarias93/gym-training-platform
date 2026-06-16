import { Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Session } from "@/types/dashboard";

type ScheduleListProps = {
  sessions: Session[];
};

export function ScheduleList({ sessions }: ScheduleListProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-[var(--fitai-text-primary)]">Proximos compromissos</p>
          <p className="text-sm text-[var(--fitai-text-secondary)]">
            Sua rotina coordenada entre performance e acompanhamento.
          </p>
        </div>
        <Clock3 className="size-5 text-[var(--fitai-text-secondary)]" />
      </div>
      <div className="mt-6 space-y-4">
        {sessions.map((session) => (
          <div
            key={session.title}
            className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-[var(--fitai-text-primary)]">{session.title}</p>
                <p className="mt-1 text-sm text-[var(--fitai-text-secondary)]">
                  {session.time}
                </p>
                <p className="mt-3 text-sm text-[var(--fitai-text-secondary)]">
                  {session.coach}
                </p>
              </div>
              <Badge
                className={cn(
                  session.status === "Hoje" && "border-[rgba(79,124,255,0.22)] bg-[rgba(79,124,255,0.10)] text-[var(--fitai-primary)]",
                  session.status === "A seguir" && "border-[rgba(0,208,132,0.18)] bg-[rgba(0,208,132,0.10)] text-[var(--fitai-success)]",
                  session.status === "Recuperacao" &&
                    "border-[rgba(255,159,67,0.20)] bg-[rgba(255,159,67,0.10)] text-[var(--fitai-warning)]"
                )}
              >
                {session.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
