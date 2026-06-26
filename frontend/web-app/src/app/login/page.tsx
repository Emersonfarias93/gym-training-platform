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
      alternateLabel="Ainda nao tem conta?"
      alternateText="Criar conta"
      description="Autentique sua operacao, valide seu acesso e retome treinos, dieta e acompanhamento com a mesma linguagem premium do ecossistema FitAI."
      eyebrow="FitAI Access"
      formSubtitle="Entre com suas credenciais para abrir seu ambiente de treino e IA."
      formTitle="Bem-vindo de volta"
      title="Entre para continuar no cockpit de performance."
    >
      <LoginForm />
    </AuthShell>
  );
}
