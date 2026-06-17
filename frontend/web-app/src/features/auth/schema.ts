import { z } from "zod";

const invalidLoginMessage = "Login ou senha invalido.";

export const loginSchema = z.object({
  email: z.string().email(invalidLoginMessage),
  password: z.string().min(1, invalidLoginMessage)
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Informe seu nome completo.")
    .max(120, "O nome pode ter no maximo 120 caracteres."),
  email: z.string().email("Informe um e-mail valido."),
  password: z
    .string()
    .min(8, "A senha precisa ter pelo menos 8 caracteres.")
    .max(64, "A senha pode ter no maximo 64 caracteres.")
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
