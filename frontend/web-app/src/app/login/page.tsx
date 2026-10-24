import { redirect } from "next/navigation";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { getServerAuthSession } from "@/services/auth/server";

export default async function LoginPage() {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/");
  }

  return (
    <AuthShell
      alternateHref="/register"
      alternateLabel="Ainda não tem conta?"
      alternateText="Criar conta"
      description="Organize seus treinos e encontre espaço para cuidar de você. Uma rotina que faz sentido, no seu ritmo."
      eyebrow="Treino com propósito"
      formSubtitle="Acesse sua conta para continuar de onde parou."
      formTitle="Bem-vindo de volta"
      title="Seu próximo treino começa aqui."
    >
      <LoginForm />
    </AuthShell>
  );
}
