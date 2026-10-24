import Link from "next/link";
import { ChevronRight, Dumbbell, UserRound } from "lucide-react";
import { pageIntro } from "@/features/navigation/config";
import type { AuthUser } from "@/types/auth";
import type { AppView } from "@/types/dashboard";

export function Topbar({ activeView, user }: { activeView: AppView; user: AuthUser }) {
  const intro = pageIntro[activeView];
  return (
    <header className="border-b border-[var(--fitai-border)] px-5 py-5 md:px-9">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[var(--fitai-text-muted)]">
          <Dumbbell className="mr-1 size-4 text-[var(--fitai-primary)] lg:hidden" />
          <Link href="/" className="hover:text-[var(--fitai-text-primary)]">
            Meu espaço
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-[var(--fitai-text-secondary)]">{intro.eyebrow}</span>
        </div>
        <Link
          href="/?view=account"
          aria-label={`Minha conta: ${user.fullName}`}
          className="flex items-center gap-2 text-xs text-[var(--fitai-text-secondary)] hover:text-[var(--fitai-text-primary)]"
        >
          <UserRound className="size-4" />
          <span className="hidden sm:inline">Minha conta</span>
        </Link>
      </div>
      <h1 className="mt-6 text-[26px] font-semibold tracking-tight md:text-[30px]">
        {intro.title}
      </h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--fitai-text-secondary)]">
        {intro.description}
      </p>
    </header>
  );
}
