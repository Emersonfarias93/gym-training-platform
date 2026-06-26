import { UtensilsCrossed } from "lucide-react";

import { ComingSoonPanel } from "@/components/shared/coming-soon-panel";

export function DietPage() {
  return (
    <ComingSoonPanel
      badge="Dieta · Em breve"
      title="A area de dieta sera refeita para a experiencia do usuario"
      description="Estamos substituindo a tela atual por uma visao mais simples de refeicoes, metas nutricionais e acompanhamento diario, sem a estrutura de painel administrativo que ainda aparece hoje."
      icon={UtensilsCrossed}
    />
  );
}
