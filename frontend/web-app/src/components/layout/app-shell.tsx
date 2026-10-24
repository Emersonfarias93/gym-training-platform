import type { ReactNode } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { sidebarItems } from "@/features/navigation/config";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";
import type { AppView } from "@/types/dashboard";

type AppShellProps = {
  activeView: AppView;
  children: ReactNode;
  user: AuthUser;
};

export function AppShell({ activeView, children, user }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--fitai-bg-shell)] text-[var(--fitai-text-primary)]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[var(--fitai-surface)] focus:p-4">Ir para o conteúdo</a>
      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar activeView={activeView} items={sidebarItems} user={user} />
        <div className="flex min-w-0 flex-1 flex-col bg-[var(--fitai-bg-page)]">
          <Topbar activeView={activeView} user={user} />
          <main id="main-content"
            className={cn(
              "flex-1 px-5 pb-28 pt-6 md:px-9 md:pt-7 lg:pb-10",
              activeView === "ai-coach" && "pt-3 md:pt-8"
            )}
          >
            {children}
          </main>
        </div>
      </div>
      <MobileNav activeView={activeView} user={user} />
    </div>
  );
}
