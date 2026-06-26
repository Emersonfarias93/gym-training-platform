import Link from "next/link";
import { ActivitySquare, Bell, Search } from "lucide-react";

import { LogoutButton } from "@/components/layout/logout-button";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { getPlanLabel, getUserInitials, hasActivePlan } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";
import type { AppView, NavItem } from "@/types/dashboard";

type SidebarProps = {
  activeView: AppView;
  items: NavItem[];
  user: AuthUser;
};

export function Sidebar({ activeView, items, user }: SidebarProps) {
  const isActivePlan = hasActivePlan(user);

  return (
    <aside className="sticky top-0 hidden h-screen w-[290px] shrink-0 overflow-hidden border-r border-[var(--fitai-border-subtle)] bg-[var(--fitai-bg-shell)] px-5 py-6 lg:flex lg:flex-col">
      <div className="shrink-0 flex items-center justify-between rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl fitai-primary-gradient text-white shadow-[0_18px_40px_-22px_rgba(79,124,255,0.9)]">
            <ActivitySquare className="size-6" />
          </div>
          <div>
            <p className="font-semibold text-[var(--fitai-text-primary)]">FitAI Coach</p>
            <p className="text-sm text-[var(--fitai-text-secondary)]">Performance SaaS</p>
          </div>
        </div>
        <Bell className="size-5 text-[var(--fitai-text-secondary)]" />
      </div>

      <div className="mt-4 shrink-0 flex items-center gap-3 rounded-full border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] px-4 py-2 text-sm text-[var(--fitai-text-secondary)]">
        <Search className="size-4" />
        Buscar modulos
      </div>

      <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={`/?view=${item.id}`}
              className={cn(
                "flex items-center justify-between rounded-[20px] px-4 py-2 text-left text-sm transition-colors",
                activeView === item.id
                  ? "border border-[var(--fitai-border)] bg-[rgba(79,124,255,0.11)] text-[var(--fitai-text-primary)]"
                  : "text-[var(--fitai-text-secondary)] hover:bg-[rgba(79,124,255,0.06)] hover:text-[var(--fitai-text-primary)]"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-4" />
                {item.label}
              </span>
              {item.badge ? (
                <Badge className="border-[rgba(0,208,132,0.18)] bg-[rgba(0,208,132,0.10)] text-[var(--fitai-success)]">
                  {item.badge}
                </Badge>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto shrink-0 space-y-3 pt-3">
        <div className="rounded-2xl border border-[var(--fitai-border)] bg-[linear-gradient(135deg,rgba(79,124,255,0.13),rgba(0,208,132,0.06))] p-4">
          <p className="text-sm font-semibold text-[var(--fitai-text-primary)]">
            {isActivePlan ? "Seu plano FitAI esta ativo" : "Ative o plano FitAI"}
          </p>
          <p className="mt-1 text-xs leading-5 text-[var(--fitai-text-secondary)]">
            {isActivePlan
              ? "AI Coach, recomendacoes inteligentes e experiencias avancadas ja estao liberados para sua conta."
              : "Libere AI Coach, recomendacoes inteligentes e experiencias avancadas."}
          </p>
          {isActivePlan ? (
            <Link className={cn(buttonVariants({ size: "sm" }), "mt-3 w-full")} href="/?view=ai-coach">
              Abrir AI Coach
            </Link>
          ) : (
            <Button size="sm" className="mt-3 w-full">Ativar plano</Button>
          )}
        </div>

        <div className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl fitai-ai-gradient text-sm font-semibold text-white">
              {getUserInitials(user.fullName)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--fitai-text-primary)]">{user.fullName}</p>
              <p className="truncate text-xs text-[var(--fitai-text-secondary)]">{user.email}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <Badge className="border-[rgba(79,124,255,0.14)] bg-[rgba(79,124,255,0.08)] text-[var(--fitai-primary)]">
              {getPlanLabel(user)}
            </Badge>
            <LogoutButton label="Sair" variant="ghost" />
          </div>
        </div>
      </div>
    </aside>
  );
}
