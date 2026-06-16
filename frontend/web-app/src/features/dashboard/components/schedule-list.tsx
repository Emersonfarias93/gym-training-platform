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
          <p className="text-lg font-semibold text-white">Proximos compromissos</p>
          <p className="text-sm text-[var(--muted-foreground)]">
            Sua rotina coordenada entre performance e acompanhamento.
          </p>
        </div>
        <Clock3 className="size-5 text-[var(--muted-foreground)]" />
      </div>
      <div className="mt-6 space-y-4">
        {sessions.map((session) => (
          <div
            key={session.title}
            className="rounded-[22px] border border-white/8 bg-white/4 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-white">{session.title}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {session.time}
                </p>
                <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                  {session.coach}
                </p>
              </div>
              <Badge
                className={cn(
                  session.status === "Hoje" && "border-emerald-400/15 bg-emerald-400/10 text-emerald-300",
                  session.status === "A seguir" && "border-cyan-400/15 bg-cyan-400/10 text-cyan-300",
                  session.status === "Recuperacao" &&
                    "border-amber-400/15 bg-amber-400/10 text-amber-300"
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
