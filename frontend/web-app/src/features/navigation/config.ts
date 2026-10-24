import {
  BarChart3,
  MessageSquare,
  UserRound,
  Dumbbell,
  LayoutDashboard,
  UtensilsCrossed
} from "lucide-react";
import type { AppView, NavItem, PageIntro } from "@/types/dashboard";

export const sidebarItems: NavItem[] = [
  { id: "dashboard", label: "Visão geral", icon: LayoutDashboard },
  { id: "workouts", label: "Meus treinos", icon: Dumbbell },
  { id: "evolution", label: "Acompanhamento", icon: BarChart3 },
  { id: "ai-coach", label: "Meu coach", icon: MessageSquare },
  { id: "diet", label: "Alimentação", icon: UtensilsCrossed },
  { id: "account", label: "Minha conta", icon: UserRound }
];

export const pageIntro: Record<AppView, PageIntro> = {
  dashboard: {
    eyebrow: "Visão geral",
    title: "Sua rotina, em dia.",
    description: "Um lugar para organizar seus treinos e dar o próximo passo.",
    filters: []
  },
  workouts: {
    eyebrow: "Meus treinos",
    title: "Treinos feitos para sua rotina.",
    description:
      "Monte sua ficha, ajuste os exercícios e escolha o treino que vai acompanhar você.",
    filters: []
  },
  diet: {
    eyebrow: "Alimentação",
    title: "Cuidar de você vai além do treino.",
    description: "Seu acompanhamento de alimentação está a caminho.",
    filters: []
  },
  evolution: {
    eyebrow: "Acompanhamento",
    title: "Seu planejamento em perspectiva.",
    description: "Consulte suas fichas e a distribuição dos exercícios planejados.",
    filters: []
  },
  "ai-coach": {
    eyebrow: "Meu coach",
    title: "Uma conversa sobre seu treino.",
    description: "Tire dúvidas e explore ajustes para sua rotina com o assistente de IA.",
    filters: []
  },
  account: {
    eyebrow: "Minha conta",
    title: "Tudo sobre sua conta.",
    description: "Consulte seus dados de acesso e os detalhes do seu plano.",
    filters: []
  }
};
