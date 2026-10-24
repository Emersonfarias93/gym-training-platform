import { UtensilsCrossed } from "lucide-react";

import { ComingSoonPanel } from "@/components/shared/coming-soon-panel";

export function DietPage() {
  return (
    <ComingSoonPanel
      badge="Dieta · Em breve"
      title="Seu espaço de alimentação está a caminho."
      description="Em breve, você poderá organizar refeições e acompanhar suas metas nutricionais por aqui. Enquanto isso, seus treinos continuam disponíveis."
      icon={UtensilsCrossed}
    />
  );
}
