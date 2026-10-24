import Link from "next/link";
import { ArrowRight, Dumbbell } from "lucide-react";
import type { ReactNode } from "react";

type AuthShellProps = {
  alternateHref: "/login" | "/register";
  alternateLabel: string;
  alternateText: string;
  children: ReactNode;
  description: string;
  eyebrow: string;
  formSubtitle: string;
  formTitle: string;
  title: string;
};

function BrandMark() {
  return (
    <Link href="/login" className="inline-flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-lg bg-[#c3d7b7] text-[#172b1e]">
        <Dumbbell className="size-5" />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        FitAI <span className="font-normal opacity-60">Coach</span>
      </span>
    </Link>
  );
}

export function AuthShell({
  alternateHref,
  alternateLabel,
  alternateText,
  children,
  description,
  eyebrow,
  formSubtitle,
  formTitle,
  title
}: AuthShellProps) {
  return (
    <div className="min-h-dvh bg-[var(--fitai-bg-shell)] text-[var(--fitai-text-primary)] lg:grid lg:grid-cols-2">
      <aside className="relative hidden min-h-dvh flex-col justify-between overflow-hidden border-r border-[#cbd8c6] bg-[#e2e8d9] text-[#1d3025] p-12 lg:flex xl:p-16">
        <BrandMark />
        <div className="relative z-10 my-14 max-w-lg">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.22em] text-[#536b50]">
            {eyebrow}
          </p>
          <h1 className="text-5xl font-semibold leading-[1.1] tracking-[-0.04em] xl:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-[#536b50]">{description}</p>
          <div className="mt-12 flex items-center gap-4">
            <span className="h-px w-12 bg-[#c3d7b7]" />
            <p className="text-xs tracking-wide text-[#536b50]">Planeje. Treine. Repita.</p>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -right-48 size-[550px] rounded-full border-[65px] border-[#d0dcc6]"
        />
        <div className="relative flex items-center justify-between border-t border-[#b9ccb0] pt-6 text-[10px] uppercase tracking-[0.18em] text-[#536b50]">
          <span>Seu ritmo. Seu progresso.</span>
          <span>FitAI / Training</span>
        </div>
      </aside>
      <main className="flex min-h-dvh flex-col px-6 py-8 sm:px-12 lg:justify-center lg:px-14 xl:px-24">
        <div className="mb-14 lg:hidden">
          <BrandMark />
        </div>
        <div className="mx-auto my-auto w-full max-w-[400px] py-6">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--fitai-primary)]">
            Seu espaço de treino
          </p>
          <h2 className="text-[30px] font-semibold tracking-tight">{formTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--fitai-text-secondary)]">
            {formSubtitle}
          </p>
          <div className="mt-9">{children}</div>
          <p className="mt-8 border-t border-[var(--fitai-border)] pt-6 text-sm text-[var(--fitai-text-secondary)]">
            {alternateLabel}{" "}
            <Link
              href={alternateHref}
              className="inline-flex items-center gap-1 font-medium text-[var(--fitai-primary)] hover:underline"
            >
              {alternateText}
              <ArrowRight className="size-3.5" />
            </Link>
          </p>
        </div>
        <p className="mt-6 text-center text-[11px] text-[var(--fitai-text-muted)]">
          FitAI Coach · Um passo de cada vez.
        </p>
      </main>
    </div>
  );
}
