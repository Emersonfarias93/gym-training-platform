import type { Plan } from "@/types/payment";

/**
 * Plano premium unico do FitAI Coach.
 * Valor de R$ 1,00 enquanto a aplicacao esta em ambiente de testes.
 */
export const FITAI_PREMIUM_PLAN: Plan = {
  id: "fitai-premium",
  name: "FitAI Premium",
  priceBRL: 1,
  description:
    "Libere o AI Coach com conversas ilimitadas, analises contextuais e experiencias personalizadas.",
  benefits: [
    "AI Coach conversacional com IA",
    "Analises contextuais do seu treino e dieta",
    "Recomendacoes e proximos passos personalizados",
    "Prioridade nas novas experiencias FitAI"
  ]
};

const BRL_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export function formatBRL(value: number) {
  return BRL_FORMATTER.format(value);
}
