export type AiCoachAuthor = "ai" | "user";

export type AiCoachMessage = {
  id: string;
  author: AiCoachAuthor;
  content: string;
  createdAt: string;
  status?: "sent" | "error";
};

export type AiCoachRequest = {
  message: string;
  history: AiCoachMessage[];
};

export type AiCoachResponse = {
  message: AiCoachMessage;
};

export type LlmGenerateRequest = {
  prompt: string;
};

export type LlmGenerateResponse = {
  generation: string;
};
