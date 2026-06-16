import type { ReactNode } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { sidebarItems } from "@/features/navigation/config";
import type { AppView } from "@/types/dashboard";

type AppShellProps = {
  activeView: AppView;
  children: ReactNode;
};

export function AppShell({ activeView, children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_24%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1680px]">
        <Sidebar activeView={activeView} items={sidebarItems} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar activeView={activeView} />
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
      <MobileNav activeView={activeView} />
    </div>
  );
}
