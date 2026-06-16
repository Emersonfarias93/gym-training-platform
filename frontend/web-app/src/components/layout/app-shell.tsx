import type { ReactNode } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { sidebarItems } from "@/features/navigation/config";
import { cn } from "@/lib/utils";
import type { AppView } from "@/types/dashboard";

type AppShellProps = {
  activeView: AppView;
  children: ReactNode;
};

export function AppShell({ activeView, children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--fitai-bg-shell)] text-[var(--fitai-text-primary)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(79,124,255,0.08),transparent_28%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1680px]">
        <Sidebar activeView={activeView} items={sidebarItems} />
        <div className="flex min-w-0 flex-1 flex-col bg-[var(--fitai-bg-page)]">
          <Topbar activeView={activeView} />
          <main
            className={cn(
              "flex-1 px-4 pb-28 pt-6 md:px-8 md:py-8",
              activeView === "ai-coach" && "pt-3 md:pt-8"
            )}
          >
            {children}
          </main>
        </div>
      </div>
      <MobileNav activeView={activeView} />
    </div>
  );
}
