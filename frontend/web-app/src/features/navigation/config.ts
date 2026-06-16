import {
  BarChart3,
  BrainCircuit,
  CalendarRange,
  Dumbbell,
  Gauge,
  Settings,
  ShieldPlus,
  UserRoundCog,
  UtensilsCrossed
} from "lucide-react";

import type { AppView, NavItem, PageIntro } from "@/types/dashboard";

export const sidebarItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Gauge },
  { id: "workouts", label: "Treinos", icon: Dumbbell },
  { id: "diet", label: "Dieta", icon: UtensilsCrossed },
  { id: "evolution", label: "Evolucao", icon: BarChart3 },
  { id: "assessments", label: "Avaliacoes", icon: ShieldPlus },
  { id: "ai-coach", label: "AI Coach", icon: BrainCircuit, badge: "Live" },
  { id: "schedule", label: "Agenda", icon: CalendarRange },
  { id: "trainer", label: "Treinador", icon: UserRoundCog },
  { id: "settings", label: "Configuracoes", icon: Settings }
];

export const pageIntro: Record<AppView, PageIntro> = {
  dashboard: {
    eyebrow: "FitAI Operating System",
    title: "Sua academia com inteligencia aplicada ao detalhe",
    description:
      "Visao consolidada de treino, dieta, agenda e insights para elevar consistencia e resultado.",
    filters: ["Hoje", "Semana", "Mensal", "Coach View"]
  },
  workouts: {
    eyebrow: "Training Engine",
    title: "Prescricao de treino com foco em performance e aderencia",
    description:
      "Monte blocos de treino, acompanhe execucao e ajuste carga com leitura rapida por atleta.",
    filters: ["Forca", "Hipertrofia", "Recovery", "Periodizacao"]
  },
  diet: {
    eyebrow: "Nutrition Control",
    title: "Painel nutricional com macros, timing e consistencia diaria",
    description:
      "Conecte refeicoes, deficits e distribuicao de macros em uma interface compacta e objetiva.",
    filters: ["Hoje", "Semana", "Cutting", "Bulking"]
  },
  evolution: {
    eyebrow: "Body Analytics",
    title: "Evolucao corporal orientada por tendencias e comparativos",
    description:
      "Leia peso, gordura, massa magra e fotos de progresso com historico pronto para decisao.",
    filters: ["30 dias", "90 dias", "1 ano", "Comparativos"]
  },
  assessments: {
    eyebrow: "Assessment Timeline",
    title: "Avaliacoes fisicas organizadas em historico e sinais de tendencia",
    description:
      "Visualize checkpoints clinicos e esportivos com alertas para reavaliacao e ajuste de plano.",
    filters: ["Recentes", "Pendentes", "Risco", "Performance"]
  },
  "ai-coach": {
    eyebrow: "FitAI Assistant",
    title: "IA conversacional para estrategia, prescricao e acompanhamento",
    description:
      "Centralize historico, prompts rapidos e respostas guiadas para reduzir operacao manual.",
    filters: ["Insights", "Treino", "Dieta", "Mensagens"]
  },
  schedule: {
    eyebrow: "Schedule Hub",
    title: "Agenda inteligente para sessoes, consultas e checkpoints",
    description:
      "Distribua compromissos com contexto de prioridade, capacidade e status em tempo real.",
    filters: ["Hoje", "Semana", "Equipe", "Capacidade"]
  },
  trainer: {
    eyebrow: "Coach Control",
    title: "Painel do treinador para operacao, alunos e prescricoes",
    description:
      "Acompanhe carteira, tarefas e oportunidades de intervencao sem perder densidade visual.",
    filters: ["Ativos", "Em risco", "Equipe", "Receita"]
  },
  settings: {
    eyebrow: "Workspace Settings",
    title: "Configuracoes de operacao, automacao e experiencia do produto",
    description:
      "Controle permissos, notificacoes, integrações e preferencias do ecossistema FitAI.",
    filters: ["Perfil", "Equipe", "Automacoes", "Seguranca"]
  }
};
