import Link from "next/link";
import { ActivitySquare, ArrowRight, BrainCircuit, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type AuthShellProps = {
  alternateHref: "/login" | "/register";
  alternateLabel: string;
  alternateText: string;
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
};

const benefits = [
  {
    icon: BrainCircuit,
    title: "IA Coach conectada",
    description: "Treinos, dieta e insights em uma unica rotina autentica e segura."
  },
  {
    icon: ShieldCheck,
    title: "Sessao protegida",
    description: "Token validado no servidor e persistencia por cookie httpOnly."
  },
  {
    icon: Sparkles,
    title: "Fluxo premium",
    description: "Acesso rapido ao dashboard com a mesma linguagem visual do Figma."
  }
];

const trustSignals = ["JWT validado", "Cookie httpOnly", "Fluxo sem CORS"];

export function AuthShell({
  alternateHref,
  alternateLabel,
  alternateText,
  children,
  description,
  eyebrow,
  title
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[var(--fitai-bg-shell)] px-4 py-6 text-[var(--fitai-text-primary)] md:px-8 md:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="relative overflow-hidden rounded-[32px] border-[var(--fitai-border)] bg-[linear-gradient(160deg,rgba(79,124,255,0.16),rgba(10,12,16,0.92)_38%,rgba(0,208,132,0.06)_100%)] p-6 md:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,124,255,0.22),transparent_32%)]" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl fitai-ai-gradient text-white shadow-[0_24px_55px_-24px_rgba(79,124,255,0.95)]">
                  <ActivitySquare className="size-6" />
                </div>
                <div>
                  <p className="font-semibold">FitAI Coach</p>
                  <p className="text-sm text-[var(--fitai-text-secondary)]">Authentication Layer</p>
                </div>
              </div>

              <Badge className="mt-10">{eyebrow}</Badge>
              <h1 className="mt-5 max-w-xl text-3xl font-semibold leading-tight md:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--fitai-text-secondary)] md:text-base">
                {description}
              </p>
            </div>

            <div className="grid gap-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    className="flex items-start gap-4 rounded-3xl border border-[var(--fitai-border)] bg-[rgba(21,24,31,0.82)] p-4"
                    key={benefit.title}
                  >
                    <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[rgba(79,124,255,0.12)] text-[var(--fitai-primary)]">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium">{benefit.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[var(--fitai-text-secondary)]">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              {trustSignals.map((signal) => (
                <span
                  className="rounded-full border border-[var(--fitai-border)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-xs font-medium text-[var(--fitai-text-secondary)]"
                  key={signal}
                >
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <Card className="flex rounded-[32px] border-[var(--fitai-border)] bg-[var(--fitai-bg-page)] p-5 md:p-7 lg:p-8">
          <div className="flex w-full flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--fitai-border-subtle)] pb-5">
              <div>
                <p className="text-sm font-semibold text-[var(--fitai-text-primary)]">Acesso FitAI</p>
                <p className="mt-1 text-sm text-[var(--fitai-text-secondary)]">
                  Continue com credenciais validas para abrir seu ambiente de treino e IA.
                </p>
              </div>

              <Link
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--fitai-primary)] transition-colors hover:text-white"
                href={alternateHref}
              >
                {alternateText}
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="flex-1 py-6">{children}</div>

            <p className="border-t border-[var(--fitai-border-subtle)] pt-5 text-sm text-[var(--fitai-text-secondary)]">
              {alternateLabel}{" "}
              <Link className="font-semibold text-[var(--fitai-primary)] hover:text-white" href={alternateHref}>
                {alternateText}
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
