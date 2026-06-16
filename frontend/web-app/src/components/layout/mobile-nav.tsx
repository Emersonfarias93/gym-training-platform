"use client";

import Link from "next/link";
import { Crown, MoreHorizontal, X } from "lucide-react";
import { useState } from "react";

import { sidebarItems } from "@/features/navigation/config";
import { cn } from "@/lib/utils";
import type { AppView } from "@/types/dashboard";

type MobileNavProps = {
  activeView: AppView;
};

const primaryNav: Array<{ id: AppView; label: string }> = [
  { id: "dashboard", label: "Início" },
  { id: "workouts", label: "Treinos" },
  { id: "ai-coach", label: "IA Coach" },
  { id: "diet", label: "Dieta" }
];

const moreNav: Array<{ id: AppView; label: string; tone: string }> = [
  {
    id: "evolution",
    label: "Evolução",
    tone: "bg-[rgba(255,159,67,0.10)] text-[var(--fitai-warning)]"
  },
  {
    id: "assessments",
    label: "Avaliações",
    tone: "bg-[rgba(79,124,255,0.10)] text-[var(--fitai-primary)]"
  },
  {
    id: "schedule",
    label: "Agenda",
    tone: "bg-[rgba(0,208,132,0.10)] text-[var(--fitai-success)]"
  },
  {
    id: "trainer",
    label: "Painel Trainer",
    tone: "bg-[rgba(155,89,255,0.10)] text-[var(--fitai-purple)]"
  },
  {
    id: "settings",
    label: "Configurações",
    tone: "bg-[var(--fitai-surface-secondary)] text-[var(--fitai-text-secondary)]"
  }
];

const navById = new Map(sidebarItems.map((item) => [item.id, item]));
const moreIds = new Set<AppView>(moreNav.map((item) => item.id));

export function MobileNav({ activeView }: MobileNavProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const isMoreActive = moreIds.has(activeView);

  return (
    <>
      {isMoreOpen ? (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.35)] backdrop-blur-[2px] lg:hidden">
          <div
            aria-modal="true"
            className="absolute inset-x-3 bottom-3 rounded-[22px] border border-[var(--fitai-border-strong)] bg-[var(--fitai-surface-elevated)] p-4 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.95)]"
            role="dialog"
          >
            <div className="mx-auto h-1 w-9 rounded-full bg-[var(--fitai-text-muted)]" />
            <div className="mt-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--fitai-text-primary)]">Mais opções</p>
              <button
                aria-label="Fechar mais opções"
                className="grid size-8 place-items-center rounded-full bg-[var(--fitai-surface-secondary)] text-[var(--fitai-text-secondary)] transition-colors hover:text-[var(--fitai-text-primary)]"
                onClick={() => setIsMoreOpen(false)}
                type="button"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {moreNav.map((item) => {
                const navItem = navById.get(item.id);
                if (!navItem) {
                  return null;
                }

                const Icon = navItem.icon;

                return (
                  <Link
                    className="flex min-h-[68px] items-center gap-4 rounded-2xl bg-[var(--fitai-surface)] px-4 text-sm font-medium text-[var(--fitai-text-secondary)] transition-colors hover:text-[var(--fitai-text-primary)]"
                    href={`/?view=${item.id}`}
                    key={item.id}
                    onClick={() => setIsMoreOpen(false)}
                  >
                    <span className={cn("grid size-10 place-items-center rounded-2xl", item.tone)}>
                      <Icon className="size-5" />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[var(--fitai-border-strong)] bg-[var(--fitai-surface)] p-3">
              <div className="grid size-10 place-items-center rounded-2xl fitai-ai-gradient text-sm font-bold text-white">
                RM
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--fitai-text-primary)]">Rafael Mendes</p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-[var(--fitai-warning)]">
                  <Crown className="size-3" />
                  Premium ativo
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--fitai-border-strong)] bg-[rgba(10,12,16,0.94)] px-4 pb-[calc(env(safe-area-inset-bottom)+0.65rem)] pt-2 shadow-[0_-18px_42px_-34px_rgba(0,0,0,0.95)] backdrop-blur-2xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 items-end">
          {primaryNav.slice(0, 2).map((item) => {
            const navItem = navById.get(item.id);
            if (!navItem) {
              return null;
            }

            const Icon = navItem.icon;

            return (
              <Link
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-medium transition-colors",
                  activeView === item.id
                    ? "text-[var(--fitai-primary)]"
                    : "text-[var(--fitai-text-muted)]"
                )}
                href={`/?view=${item.id}`}
                key={item.id}
              >
                <Icon className="size-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Link
            className="relative -mt-7 flex min-h-20 flex-col items-center justify-start gap-1 text-[10px] font-medium text-[var(--fitai-text-secondary)]"
            href="/?view=ai-coach"
          >
            <span
              className={cn(
                "grid size-12 place-items-center rounded-2xl fitai-ai-gradient text-white shadow-[0_18px_40px_-18px_rgba(79,124,255,0.95)]",
                activeView === "ai-coach" && "ring-2 ring-[rgba(79,124,255,0.45)]"
              )}
            >
              {(() => {
                const Icon = navById.get("ai-coach")?.icon;
                return Icon ? <Icon className="size-5" /> : null;
              })()}
            </span>
            <span>IA Coach</span>
          </Link>

          {primaryNav.slice(3).map((item) => {
            const navItem = navById.get(item.id);
            if (!navItem) {
              return null;
            }

            const Icon = navItem.icon;

            return (
              <Link
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-medium transition-colors",
                  activeView === item.id
                    ? "text-[var(--fitai-primary)]"
                    : "text-[var(--fitai-text-muted)]"
                )}
                href={`/?view=${item.id}`}
                key={item.id}
              >
                <Icon className="size-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            aria-expanded={isMoreOpen}
            aria-label="Abrir mais opções"
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-medium transition-colors",
              isMoreActive ? "text-[var(--fitai-primary)]" : "text-[var(--fitai-text-muted)]"
            )}
            onClick={() => setIsMoreOpen(true)}
            type="button"
          >
            <MoreHorizontal className="size-5" />
            <span>Mais</span>
          </button>
        </div>
      </nav>
    </>
  );
}
