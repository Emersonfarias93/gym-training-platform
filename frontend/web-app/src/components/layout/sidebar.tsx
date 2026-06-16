import Link from "next/link";
import { ActivitySquare, Bell, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppView, NavItem } from "@/types/dashboard";

type SidebarProps = {
  activeView: AppView;
  items: NavItem[];
};

export function Sidebar({ activeView, items }: SidebarProps) {
  return (
    <aside className="hidden w-[290px] shrink-0 border-r border-white/6 bg-black/20 px-5 py-6 lg:flex lg:flex-col">
      <div className="flex items-center justify-between rounded-[26px] border border-white/8 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] text-white shadow-[0_18px_40px_-18px_rgba(34,197,94,0.85)]">
            <ActivitySquare className="size-6" />
          </div>
          <div>
            <p className="font-semibold text-white">FitAI Coach</p>
            <p className="text-sm text-[var(--muted-foreground)]">Performance SaaS</p>
          </div>
        </div>
        <Bell className="size-5 text-[var(--muted-foreground)]" />
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-full border border-white/8 bg-white/4 px-4 py-3 text-sm text-[var(--muted-foreground)]">
        <Search className="size-4" />
        Buscar modulos
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={`/?view=${item.id}`}
              className={cn(
                "flex items-center justify-between rounded-[20px] px-4 py-3 text-left text-sm transition-colors",
                activeView === item.id
                  ? "bg-[linear-gradient(135deg,rgba(34,197,94,0.18),rgba(16,185,129,0.08))] text-white"
                  : "text-[var(--muted-foreground)] hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-4" />
                {item.label}
              </span>
              {item.badge ? (
                <Badge className="border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                  {item.badge}
                </Badge>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_70%),rgba(255,255,255,0.04)] p-5">
        <p className="font-semibold text-white">Upgrade Pro Coach</p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          Libere modelos de prescricao, relatorios automaticos e previsoes avancadas.
        </p>
        <Button className="mt-4 w-full">Ativar plano</Button>
      </div>
    </aside>
  );
}
