import type { AiCoachMessage } from "@/types/ai-coach";
import type { AuthUser } from "@/types/auth";

const MAX_HISTORY_MESSAGES = 8;

export const initialAiCoachMessage: AiCoachMessage = {
  id: "welcome",
  author: "ai",
  createdAt: new Date(0).toISOString(),
  content:
    "Ola! Sou o FitAI Coach, seu assistente de treino, dieta e evolucao. Posso analisar seu contexto, sugerir ajustes e montar proximos passos praticos."
};

export const quickPrompts = [
  "Criar plano semanal",
  "Analise calorica",
  "Dica de hoje",
  "Tecnicas avancadas"
];

export function createAiCoachMessage(author: "ai" | "user", content: string): AiCoachMessage {
  const now = new Date();

  return {
    id: `${author}-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    author,
    content,
    createdAt: now.toISOString()
  };
}

export function formatMessageTime(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function buildAiCoachPrompt({
  history,
  message,
  user
}: {
  history: AiCoachMessage[];
  message: string;
  user: AuthUser;
}) {
  const recentHistory = history
    .filter((item) => item.id !== initialAiCoachMessage.id)
    .slice(-MAX_HISTORY_MESSAGES)
    .map((item) => `${item.author === "user" ? "Aluno" : "FitAI Coach"}: ${item.content}`)
    .join("\n");

  return [
    "Voce e o FitAI Coach, uma IA especializada em treino, dieta, evolucao corporal e aderencia.",
    "Responda em portugues do Brasil, com tom direto, profissional e acolhedor.",
    "Priorize orientacoes praticas, seguras e acionaveis. Nao invente dados clinicos ou historico que nao foram informados.",
    "Se a pergunta envolver lesao, dor forte, doenca ou medicacao, oriente procurar profissional de saude.",
    `Usuario autenticado: ${user.fullName} (${user.role}).`,
    recentHistory ? `Historico recente:\n${recentHistory}` : "Historico recente: primeira mensagem da conversa.",
    `Mensagem atual do aluno: ${message}`,
    "Formato desejado: resposta enxuta, com bullets quando ajudar, e uma pergunta final curta para continuar o acompanhamento."
  ].join("\n\n");
}
