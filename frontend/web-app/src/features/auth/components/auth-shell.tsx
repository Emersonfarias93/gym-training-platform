import Link from "next/link";
import { ActivitySquare, ArrowRight, BrainCircuit, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

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

const benefits = [
  {
    icon: BrainCircuit,
    title: "IA Coach conectada",
    description: "Treinos, dieta e insights em uma rotina unica."
  },
  {
    icon: ShieldCheck,
    title: "Sessao protegida",
    description: "Token validado no servidor e cookie httpOnly."
  },
  {
    icon: Sparkles,
    title: "Fluxo premium",
    description: "A mesma linguagem visual do Figma FitAI."
  }
];

const trustSignals = ["JWT validado", "Cookie httpOnly", "Fluxo sem CORS"];

function BrandMark({ subtitle }: { subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-11 place-items-center rounded-2xl fitai-ai-gradient text-white shadow-[0_24px_55px_-24px_rgba(79,124,255,0.95)]">
        <ActivitySquare className="size-5" />
      </div>
      <div>
        <p className="font-semibold leading-tight">FitAI Coach</p>
        <p className="text-sm text-[var(--fitai-text-secondary)]">{subtitle}</p>
      </div>
    </div>
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--fitai-bg-shell)] px-4 py-6 text-[var(--fitai-text-primary)] md:px-8 md:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,124,255,0.16),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,208,132,0.08),transparent_36%)]" />

      <div className="relative w-full max-w-6xl">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-[var(--fitai-border)] bg-[var(--fitai-surface)] shadow-[0_50px_140px_-60px_rgba(0,0,0,0.95)] lg:grid-cols-[1.05fr_0.95fr]">
          {/* Painel de marca (somente desktop) */}
          <aside className="relative hidden flex-col justify-between gap-10 overflow-hidden bg-[linear-gradient(160deg,rgba(79,124,255,0.18),rgba(10,12,16,0.92)_42%,rgba(0,208,132,0.07)_100%)] p-10 lg:flex">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,124,255,0.22),transparent_34%)]" />

            <div className="relative">
              <BrandMark subtitle="Authentication Layer" />

              <Badge className="mt-10">{eyebrow}</Badge>
              <h1 className="mt-5 max-w-md text-4xl font-semibold leading-tight">{title}</h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-[var(--fitai-text-secondary)]">
                {description}
              </p>
            </div>

            <div className="relative grid gap-5">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div className="flex items-start gap-3" key={benefit.title}>
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[rgba(79,124,255,0.12)] text-[var(--fitai-primary)]">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-tight">{benefit.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[var(--fitai-text-secondary)]">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative flex flex-wrap gap-2">
              {trustSignals.map((signal) => (
                <span
                  className="rounded-full border border-[var(--fitai-border)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-xs font-medium text-[var(--fitai-text-secondary)]"
                  key={signal}
                >
                  {signal}
                </span>
              ))}
            </div>
          </aside>

          {/* Painel do formulario */}
          <div className="flex flex-col bg-[var(--fitai-bg-page)] p-6 md:p-9 lg:p-10">
            {/* Logo compacto: visivel apenas no mobile (no desktop a marca esta a esquerda) */}
            <div className="mb-8 lg:hidden">
              <BrandMark subtitle="Acesso FitAI" />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--fitai-text-primary)]">
                {formTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">{formSubtitle}</p>

              <div className="mt-7">{children}</div>
            </div>

            <p className="mt-8 border-t border-[var(--fitai-border-subtle)] pt-6 text-sm text-[var(--fitai-text-secondary)]">
              {alternateLabel}{" "}
              <Link
                className="inline-flex items-center gap-1 font-semibold text-[var(--fitai-primary)] transition-colors hover:text-white"
                href={alternateHref}
              >
                {alternateText}
                <ArrowRight className="size-4" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
