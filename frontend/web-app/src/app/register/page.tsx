import { redirect } from "next/navigation";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";
import { getServerAuthSession } from "@/services/auth/server";

export default async function RegisterPage() {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/");
  }

  return (
    <AuthShell
      alternateHref="/login"
      alternateLabel="Ja possui acesso?"
      alternateText="Entrar agora"
      description="Crie sua conta FitAI e comece com uma sessao integrada ao auth-service, pronta para escalar com treino, dieta e IA coach."
      eyebrow="FitAI Onboarding"
      title="Crie sua conta e ative a experiencia completa."
    >
      <RegisterForm />
    </AuthShell>
  );
}
