import { CalendarDays } from "lucide-react";

import { ComingSoonPanel } from "@/components/shared/coming-soon-panel";

export function SchedulePage() {
  return (
    <ComingSoonPanel
      badge="Agenda · Em breve"
      title="A agenda sera ajustada para o cotidiano do usuario"
      description="Vamos refatorar essa area para exibir compromissos, treinos e lembretes pessoais em um formato mais direto, sem a linguagem de gestao administrativa da versao atual."
      icon={CalendarDays}
    />
  );
}
