import { BarChart3, Dumbbell, Layers3, RefreshCcw } from "lucide-react";

export type WorkoutObjectiveId = "strength" | "hypertrophy" | "recovery" | "periodization";

export type WorkoutObjective = {
  id: WorkoutObjectiveId;
  label: string;
  /** Valor persistido como `goal` no backend. */
  manualGoal: string;
  /** Texto enviado como `focus` para a geracao por IA. */
  requestFocus: string;
  title: string;
  description: string;
  helper: string;
  icon: typeof Dumbbell;
  defaultPlanTitle: string;
  defaultSessionTitle: string;
  recommendedIntensity: string;
};

export const WORKOUT_OBJECTIVES: WorkoutObjective[] = [
  {
    id: "strength",
    label: "Força",
    manualGoal: "STRENGTH",
    requestFocus: "forca",
    title: "Bloco com prioridade em carga e técnica",
    description: "Bom para organizar exercícios base, progressão de carga e descansos um pouco maiores.",
    helper: "Use a ficha manual para registrar movimentos principais e acompanhar sua própria progressão.",
    icon: Dumbbell,
    defaultPlanTitle: "Plano de força semanal",
    defaultSessionTitle: "Treino principal de força",
    recommendedIntensity: "Alta"
  },
  {
    id: "hypertrophy",
    label: "Hipertrofia",
    manualGoal: "HYPERTROPHY",
    requestFocus: "hipertrofia",
    title: "Treino com foco em volume e construção muscular",
    description: "Melhor para distribuir grupamentos, faixas de repetição e volume total ao longo da semana.",
    helper: "Registre series, repeticoes e observacoes para comparar como seu treino evolui.",
    icon: Layers3,
    defaultPlanTitle: "Plano de hipertrofia",
    defaultSessionTitle: "Sessão de hipertrofia",
    recommendedIntensity: "Moderada alta"
  },
  {
    id: "recovery",
    label: "Recuperação",
    manualGoal: "RECOVERY",
    requestFocus: "recovery",
    title: "Sessão para recuperar, mobilizar e manter consistencia",
    description: "Ajuda a deixar salvos treinos leves, mobilidade e dias de menor desgaste.",
    helper: "Use cargas livres, notas de mobilidade e descansos mais confortáveis.",
    icon: RefreshCcw,
    defaultPlanTitle: "Plano de recuperação ativa",
    defaultSessionTitle: "Sessão de recovery",
    recommendedIntensity: "Leve"
  },
  {
    id: "periodization",
    label: "Periodização",
    manualGoal: "PERIODIZATION",
    requestFocus: "periodização",
    title: "Estrutura orientada por ciclo",
    description: "Funciona bem para registrar blocos por fase, mantendo a sessão organizada por objetivo do ciclo.",
    helper: "No plano ativo, esse foco segue como o melhor ponto de partida para a IA montar sua próxima ficha.",
    icon: BarChart3,
    defaultPlanTitle: "Plano de periodização",
    defaultSessionTitle: "Sessão do ciclo atual",
    recommendedIntensity: "Moderada"
  }
];

export const DEFAULT_OBJECTIVE: WorkoutObjective = WORKOUT_OBJECTIVES[1];

export function getObjectiveById(id: WorkoutObjectiveId): WorkoutObjective {
  return WORKOUT_OBJECTIVES.find((objective) => objective.id === id) ?? DEFAULT_OBJECTIVE;
}

export function getObjectiveByGoal(goal: string | null | undefined): WorkoutObjective {
  if (!goal) {
    return DEFAULT_OBJECTIVE;
  }
  const normalized = goal.trim().toUpperCase();
  return WORKOUT_OBJECTIVES.find((objective) => objective.manualGoal === normalized) ?? DEFAULT_OBJECTIVE;
}
