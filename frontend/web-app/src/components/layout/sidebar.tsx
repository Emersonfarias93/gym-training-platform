import Link from "next/link";
import { ArrowUpRight, Dumbbell } from "lucide-react";
import { LogoutButton } from "@/components/layout/logout-button";
import { UpgradePlanButton } from "@/features/checkout/upgrade-plan-button";
import { getPlanLabel, getUserInitials, hasActivePlan } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";
import type { AppView, NavItem } from "@/types/dashboard";

type SidebarProps = { activeView: AppView; items: NavItem[]; user: AuthUser };

export function Sidebar({ activeView, items, user }: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col border-r border-[var(--fitai-border)] bg-[var(--fitai-bg-shell)] px-5 py-8 lg:flex">
      <Link href="/" aria-label="FitAI Coach — início" className="flex items-center gap-3 px-2">
        <span className="grid size-9 place-items-center rounded-lg bg-[var(--fitai-primary)] text-white">
          <Dumbbell className="size-5" strokeWidth={2} />
        </span>
        <span className="text-lg font-semibold tracking-tight">
          FitAI<span className="ml-1 font-normal text-[var(--fitai-text-muted)]">Coach</span>
        </span>
      </Link>
      <p className="mb-3 mt-12 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--fitai-text-muted)]">
        Seu espaço
      </p>
      <nav aria-label="Navegação principal" className="min-h-0 flex-1 space-y-1 overflow-y-auto">
        {items.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            href={`/?view=${id}`}
            aria-current={activeView === id ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
              activeView === id
                ? "bg-[var(--sidebar-accent)] font-semibold text-[var(--fitai-primary)]"
                : "text-[var(--fitai-text-secondary)] hover:bg-[var(--fitai-surface)] hover:text-[var(--fitai-text-primary)]"
            )}
          >
            <Icon className="size-[18px]" strokeWidth={1.7} />
            {label}
            {id === "diet" ? (
              <span className="ml-auto text-[10px] text-[var(--fitai-text-muted)]">Em breve</span>
            ) : null}
          </Link>
        ))}
      </nav>
      {!hasActivePlan(user) ? (
        <div className="mb-6 rounded-xl border border-[var(--fitai-border-strong)] p-4">
          <p className="flex items-center justify-between text-sm font-semibold">
            Mais possibilidades <ArrowUpRight className="size-4 text-[var(--fitai-primary)]" />
          </p>
          <p className="mb-4 mt-2 text-xs leading-5 text-[var(--fitai-text-secondary)]">
            Crie treinos assistidos e converse com seu coach no Premium.
          </p>
          <UpgradePlanButton size="sm" className="w-full" />
        </div>
      ) : null}
      <div className="border-t border-[var(--fitai-border)] pt-5">
        <Link href="/?view=account" className="flex items-center gap-3 rounded-lg p-1">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--fitai-surface-secondary)] text-xs font-semibold">
            {getUserInitials(user.fullName)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{user.fullName}</span>
            <span className="block text-xs text-[var(--fitai-text-muted)]">
              {getPlanLabel(user)}
            </span>
          </span>
        </Link>
        <LogoutButton className="mt-3 w-full justify-start px-2" label="Sair da conta" />
      </div>
    </aside>
  );
}
