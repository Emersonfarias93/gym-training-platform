import {
  BarChart3,
  BrainCircuit,
  CreditCard,
  Dumbbell,
  Gauge,
  UtensilsCrossed
} from "lucide-react";

import type { AppView, NavItem, PageIntro } from "@/types/dashboard";

export const sidebarItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Gauge },
  { id: "workouts", label: "Treinos", icon: Dumbbell },
  { id: "diet", label: "Dieta", icon: UtensilsCrossed },
  { id: "evolution", label: "Evolucao", icon: BarChart3 },
  { id: "ai-coach", label: "AI Coach", icon: BrainCircuit, badge: "Live" },
  { id: "account", label: "Conta", icon: CreditCard }
];

export const pageIntro: Record<AppView, PageIntro> = {
  dashboard: {
    eyebrow: "Visao geral",
    title: "Seu resumo de treino e evolucao",
    description:
      "Acompanhe seus treinos, sua sessao atual e o que da para desbloquear com o plano ativo.",
    filters: []
  },
  workouts: {
    eyebrow: "Training Engine",
    title: "Treinos manuais ou com IA, conforme o seu plano",
    description:
      "Usuarios comuns podem montar a propria ficha manualmente; usuarios com plano ativo geram e acompanham treinos com IA.",
    filters: []
  },
  diet: {
    eyebrow: "Dieta",
    title: "Experiencia de dieta em refatoracao",
    description:
      "Essa area sera reorganizada para o fluxo do usuario final. Por enquanto, ela permanece como um aviso de transicao.",
    filters: []
  },
  evolution: {
    eyebrow: "Evolucao",
    title: "Evolucao dos seus treinos",
    description:
      "Acompanhe treino ativo, exercicios cadastrados e historico a partir das fichas salvas na sua conta.",
    filters: []
  },
  "ai-coach": {
    eyebrow: "FitAI Assistant",
    title: "IA conversacional para estrategia, prescricao e acompanhamento",
    description:
      "Centralize historico, prompts rapidos e respostas guiadas para usuarios com plano ativo.",
    filters: ["Insights", "Treino", "Dieta", "Mensagens"]
  },
  account: {
    eyebrow: "Conta e assinatura",
    title: "Plano, dados pessoais e pagamentos em um so lugar",
    description:
      "Acompanhe sua assinatura mensal, vencimento do plano, dados basicos e historico de cobrancas.",
    filters: ["Plano", "Pagamentos", "LGPD", "Perfil"]
  }
};
