import {
  BarChart3,
  BrainCircuit,
  CreditCard,
  Dumbbell,
  Gauge,
  Settings,
  UtensilsCrossed
} from "lucide-react";

import type { AppView, NavItem, PageIntro } from "@/types/dashboard";

export const sidebarItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Gauge },
  { id: "workouts", label: "Treinos", icon: Dumbbell },
  { id: "diet", label: "Dieta", icon: UtensilsCrossed },
  { id: "evolution", label: "Evolucao", icon: BarChart3 },
  { id: "ai-coach", label: "AI Coach", icon: BrainCircuit, badge: "Live" },
  { id: "account", label: "Conta", icon: CreditCard },
  { id: "settings", label: "Configuracoes", icon: Settings }
];

export const pageIntro: Record<AppView, PageIntro> = {
  dashboard: {
    eyebrow: "FitAI Operating System",
    title: "Sua academia com inteligencia aplicada ao detalhe",
    description:
      "Visao consolidada de treino, dieta, agenda e insights para elevar consistencia e resultado.",
    filters: ["Hoje", "Semana", "Mensal", "Plano ativo"]
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
    eyebrow: "Body Analytics",
    title: "Evolucao corporal orientada por tendencias e comparativos",
    description:
      "Leia peso, gordura, massa magra e fotos de progresso com historico pronto para decisao.",
    filters: ["30 dias", "90 dias", "1 ano", "Comparativos"]
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
  },
  settings: {
    eyebrow: "Workspace Settings",
    title: "Configuracoes de operacao, automacao e experiencia do produto",
    description:
      "Controle perfil, notificacoes, integrações e preferencias do ecossistema FitAI.",
    filters: ["Perfil", "Plano", "Automacoes", "Seguranca"]
  }
};
