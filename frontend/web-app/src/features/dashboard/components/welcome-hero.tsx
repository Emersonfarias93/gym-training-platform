import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import type { AuthUser } from "@/types/auth";

export function WelcomeHero({ user, isActivePlan }: { user: AuthUser; isActivePlan: boolean }) {
  const firstName = user.fullName.trim().split(/\s+/)[0] || "atleta";
  return (
    <section className="relative overflow-hidden rounded-xl bg-[#e2e8d9] px-6 py-8 text-[#1d3025] md:px-8 md:py-9">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-20 hidden size-80 rounded-full border-[32px] border-[#ced9c5] md:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-16 hidden size-64 rounded-full border border-[#b6c7aa] md:block"
      />
      <div className="relative max-w-xl">
        <p className="text-xs font-medium text-[#4b604e]">Olá, {firstName}.</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight md:text-[36px]">
          Constância começa
          <br />
          com um bom plano.
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-6 text-[#4b604e]">
          Separe um tempo para você. Organize o próximo treino e siga no seu ritmo.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href="/?view=workouts"
            className="inline-flex min-h-11 items-center gap-6 rounded-lg bg-[#253e2f] px-5 text-sm font-medium text-white transition-colors hover:bg-[#355641]"
          >
            Meus treinos <ArrowRight className="size-4" />
          </Link>
          {isActivePlan ? (
            <Link
              href="/?view=ai-coach"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:underline"
            >
              <MessageSquare className="size-4" /> Conversar com meu coach
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
