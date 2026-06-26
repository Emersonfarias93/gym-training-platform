import {
  Activity,
  BarChart3,
  HeartPulse,
  Sparkles,
  Target,
  UtensilsCrossed,
  Zap
} from "lucide-react";

import type { Insight, Metric, Session } from "@/types/dashboard";

export const metrics: Metric[] = [
  {
    label: "Treinos concluidos",
    value: "18",
    delta: "+12%",
    helper: "vs. semana passada",
    trend: "up"
  },
  {
    label: "Aderencia nutricional",
    value: "92%",
    delta: "+4.6%",
    helper: "meta em alta",
    trend: "up"
  },
  {
    label: "Recuperacao media",
    value: "7.8h",
    delta: "-0.4h",
    helper: "sono da ultima semana",
    trend: "down"
  },
  {
    label: "Score de performance",
    value: "86",
    delta: "+9 pts",
    helper: "indice proprietario FitAI",
    trend: "up"
  }
];

export const weeklyLoad = [
  { day: "Seg", percent: 74 },
  { day: "Ter", percent: 88 },
  { day: "Qua", percent: 52 },
  { day: "Qui", percent: 93 },
  { day: "Sex", percent: 79 },
  { day: "Sab", percent: 61 },
  { day: "Dom", percent: 46 }
];

export const nextSessions: Session[] = [
  {
    title: "Upper Strength + Core",
    time: "Hoje, 18:30",
    source: "Plano ativo",
    status: "Hoje"
  },
  {
    title: "Check-in nutricional",
    time: "Amanha, 08:00",
    source: "FitAI Dieta",
    status: "A seguir"
  },
  {
    title: "Mobilidade + Recovery",
    time: "Quarta, 07:15",
    source: "AI Flow",
    status: "Recuperacao"
  }
];

export const insights: Insight[] = [
  {
    title: "Pronto para progressao",
    body: "Seu volume de treino se manteve alto com boa recuperacao. Podemos elevar carga em membros superiores nesta semana."
  },
  {
    title: "Janela ideal para cardio",
    body: "Seu historico mostra melhor consistencia em cardio leve entre 07:00 e 08:30. Vale priorizar esse horario."
  }
];

export const focusAreas = [
  {
    label: "Forca",
    icon: Target,
    progress: 81,
    tone: "primary" as const
  },
  {
    label: "Condicionamento",
    icon: Activity,
    progress: 67,
    tone: "success" as const
  },
  {
    label: "Recuperacao",
    icon: HeartPulse,
    progress: 72,
    tone: "warning" as const
  }
];

export const quickActions = [
  { label: "Gerar treino", icon: Sparkles },
  { label: "Revisar macros", icon: UtensilsCrossed },
  { label: "Comparar avaliacoes", icon: BarChart3 }
];

export const heroPills = [
  { label: "Streak", value: "21 dias" },
  { label: "Compliance", value: "94%" },
  { label: "Recovery", value: "Otima" }
];

export const highlightSessions = [
  {
    title: "Lower Body Power",
    source: "Plano ativo",
    time: "18:30",
    intensity: "Alta",
    completion: 82
  },
  {
    title: "Nutrition Review",
    source: "FitAI Dieta",
    time: "08:00",
    intensity: "Media",
    completion: 61
  },
  {
    title: "Mobility Flow",
    source: "AI Recovery",
    time: "07:15",
    intensity: "Baixa",
    completion: 46
  }
];

export const performanceSignals = [
  { label: "Carga sugerida", value: "+4 kg", icon: Zap },
  { label: "Consistencia cardio", value: "5/7", icon: Activity },
  { label: "Deficit atual", value: "-320 kcal", icon: Target }
];
