import Link from "next/link";
import { BrainCircuit, Dumbbell, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UpgradePlanButton } from "@/features/checkout/upgrade-plan-button";
import { getPlanLabel } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";

type WelcomeHeroProps = {
  user: AuthUser;
  isActivePlan: boolean;
};

function getFirstName(fullName: string) {
  const first = fullName.trim().split(/\s+/)[0];
  return first || "atleta";
}

export function WelcomeHero({ user, isActivePlan }: WelcomeHeroProps) {
  return (
    <Card className="overflow-hidden p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <Badge>{isActivePlan ? "Plano ativo" : "Plano Free"}</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[var(--fitai-text-primary)] md:text-4xl">
            Ola, {getFirstName(user.fullName)}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--fitai-text-secondary)] md:text-base">
            {isActivePlan
              ? "Aqui esta o resumo do seu treino. Gere novas fichas com IA, acompanhe sua sessao e fale com o AI Coach."
              : "Organize seus treinos e acompanhe sua rotina. Ative o plano para liberar a IA, o AI Coach e mais."}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {isActivePlan ? (
              <>
                <Link className={cn(buttonVariants({}))} href="/?view=workouts">
                  <Sparkles className="size-4" />
                  Gerar treino com IA
                </Link>
                <Link className={cn(buttonVariants({ variant: "secondary" }))} href="/?view=ai-coach">
                  <BrainCircuit className="size-4" />
                  Falar com AI Coach
                </Link>
              </>
            ) : (
              <>
                <UpgradePlanButton withIcon size="md" />
                <Link className={cn(buttonVariants({ variant: "secondary" }))} href="/?view=workouts">
                  <Dumbbell className="size-4" />
                  Criar treino manual
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-5">
          <p className="text-sm text-[var(--fitai-text-secondary)]">Seu plano</p>
          <p className="mt-2 text-xl font-semibold text-[var(--fitai-text-primary)]">{getPlanLabel(user)}</p>
          <p className={cn("mt-1 text-sm", isActivePlan ? "text-[var(--fitai-success)]" : "text-[var(--fitai-text-muted)]")}>
            {isActivePlan ? user.planName ?? "Assinatura mensal ativa" : "Recursos essenciais liberados"}
          </p>
        </div>
      </div>
    </Card>
  );
}
