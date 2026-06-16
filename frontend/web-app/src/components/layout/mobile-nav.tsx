import Link from "next/link";

import { sidebarItems } from "@/features/navigation/config";
import { cn } from "@/lib/utils";
import type { AppView } from "@/types/dashboard";

type MobileNavProps = {
  activeView: AppView;
};

export function MobileNav({ activeView }: MobileNavProps) {
  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-full border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-2xl lg:hidden">
      {sidebarItems.slice(0, 5).map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={`/?view=${item.id}`}
            className={cn(
              "flex min-w-14 flex-col items-center gap-1 rounded-full px-2 py-2 text-[10px] font-medium transition-colors",
              activeView === item.id ? "text-white" : "text-[var(--muted-foreground)]"
            )}
          >
            <Icon className="size-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
