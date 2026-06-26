import { ClipboardList } from "lucide-react";

import { ComingSoonPanel } from "@/components/shared/coming-soon-panel";

export function AssessmentsPage() {
  return (
    <ComingSoonPanel
      badge="Avaliacoes · Em breve"
      title="As avaliacoes serao reorganizadas para o acompanhamento pessoal"
      description="Essa tela sera reconstruida para mostrar historico, comparativos e proximas medicoes no contexto do proprio usuario, em vez da estrutura operacional usada hoje."
      icon={ClipboardList}
    />
  );
}
