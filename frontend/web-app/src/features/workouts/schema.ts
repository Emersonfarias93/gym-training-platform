import { z } from "zod";

export const manualWorkoutExerciseSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do exercicio.").max(140, "Use ate 140 caracteres."),
  setsDescription: z.string().trim().min(1, "Informe as series.").max(40, "Use ate 40 caracteres."),
  repsDescription: z.string().trim().min(1, "Informe as repeticoes.").max(40, "Use ate 40 caracteres."),
  restSeconds: z
    .number({ message: "Informe o descanso em segundos." })
    .min(0, "O descanso nao pode ser negativo.")
    .max(600, "Use ate 600 segundos."),
  loadSuggestion: z.string().trim().max(120, "Use ate 120 caracteres.").optional().or(z.literal("")),
  executionNotes: z.string().trim().max(1000, "Use ate 1000 caracteres.").optional().or(z.literal(""))
});

export const manualWorkoutSchema = z.object({
  title: z.string().trim().min(3, "Informe um titulo para o plano.").max(140, "Use ate 140 caracteres."),
  sessionTitle: z
    .string()
    .trim()
    .min(3, "Informe um titulo para a sessao.")
    .max(140, "Use ate 140 caracteres."),
  scheduledDate: z.string().min(1, "Escolha a data do treino."),
  estimatedDurationMinutes: z
    .number({ message: "Informe a duracao estimada." })
    .min(15, "Use pelo menos 15 minutos.")
    .max(240, "Use ate 240 minutos."),
  intensity: z.string().trim().min(3, "Informe a intensidade.").max(40, "Use ate 40 caracteres."),
  exercises: z
    .array(manualWorkoutExerciseSchema)
    .min(1, "Adicione pelo menos um exercicio.")
    .max(12, "Use ate 12 exercicios por sessao.")
});

export type ManualWorkoutFormValues = z.infer<typeof manualWorkoutSchema>;
