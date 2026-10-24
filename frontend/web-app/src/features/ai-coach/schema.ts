import { z } from "zod";

export const aiCoachRequestSchema = z.object({
  message: z.string().trim().min(1, "Digite uma mensagem.").max(4000, "Use até 4.000 caracteres."),
  history: z.array(z.object({
    id: z.string().max(120),
    author: z.enum(["ai", "user"]),
    content: z.string().max(12000),
    createdAt: z.string().max(50),
    status: z.enum(["sent", "error"]).optional()
  })).max(100).default([])
});
