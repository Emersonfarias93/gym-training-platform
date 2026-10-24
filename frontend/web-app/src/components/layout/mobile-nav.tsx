"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { LogoutButton } from "@/components/layout/logout-button";
import { Dialog } from "@/components/ui/dialog";
import { sidebarItems } from "@/features/navigation/config";
import { getPlanLabel, getUserInitials } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";
import type { AppView } from "@/types/dashboard";

const primaryIds: AppView[] = ["dashboard", "workouts", "evolution", "ai-coach"];
const labels: Partial<Record<AppView, string>> = {
  dashboard: "Início",
  workouts: "Treinos",
  evolution: "Resumo",
  "ai-coach": "Coach"
};

export function MobileNav({ activeView, user }: { activeView: AppView; user: AuthUser }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--fitai-border)] bg-[var(--fitai-bg-shell)] px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 lg:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {primaryIds.map((id) => {
            const item = sidebarItems.find((entry) => entry.id === id)!;
            const Icon = item.icon;
            return (
              <Link
                key={id}
                href={`/?view=${id}`}
                aria-current={activeView === id ? "page" : undefined}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-1.5 rounded-lg text-[10px] font-medium",
                  activeView === id
                    ? "bg-[var(--sidebar-accent)] text-[var(--fitai-primary)]"
                    : "text-[var(--fitai-text-muted)]"
                )}
              >
                <Icon className="size-[18px]" />
                <span>{labels[id]}</span>
              </Link>
            );
          })}
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className={cn(
              "flex min-h-12 flex-col items-center justify-center gap-1.5 rounded-lg text-[10px] font-medium",
              ["diet", "account"].includes(activeView)
                ? "text-[var(--fitai-primary)]"
                : "text-[var(--fitai-text-muted)]"
            )}
          >
            <MoreHorizontal className="size-[18px]" />
            Mais
          </button>
        </div>
      </nav>
      <Dialog open={open} onOpenChange={setOpen} title="Mais opções">
        <div className="flex items-center gap-3 border-b border-[var(--fitai-border)] pb-5">
          <span className="grid size-10 place-items-center rounded-full bg-[var(--fitai-surface-secondary)] text-sm font-semibold">
            {getUserInitials(user.fullName)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.fullName}</p>
            <p className="mt-1 text-xs text-[var(--fitai-text-secondary)]">{getPlanLabel(user)}</p>
          </div>
        </div>
        <div className="my-3 space-y-1">
          {sidebarItems
            .filter((item) => !primaryIds.includes(item.id))
            .map(({ id, label, icon: Icon }) => (
              <Link
                key={id}
                href={`/?view=${id}`}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center gap-3 rounded-lg px-2 text-sm hover:bg-[var(--fitai-surface-secondary)]"
              >
                <Icon className="size-4 text-[var(--fitai-primary)]" />
                {label}
                {id === "diet" ? (
                  <span className="ml-auto text-xs text-[var(--fitai-text-muted)]">Em breve</span>
                ) : null}
              </Link>
            ))}
        </div>
        <LogoutButton className="w-full" label="Sair da conta" variant="secondary" />
      </Dialog>
    </>
  );
}
