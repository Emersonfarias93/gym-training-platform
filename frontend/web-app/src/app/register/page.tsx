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
      alternateLabel="Já tem uma conta?"
      alternateText="Entrar agora"
      description="Comece pelo básico: um plano, um objetivo e tempo para você. Seus treinos organizados em um só lugar."
      eyebrow="Um novo começo"
      formSubtitle="Preencha seus dados para começar no plano gratuito."
      formTitle="Crie sua conta"
      title="Uma rotina que começa com você."
    >
      <RegisterForm />
    </AuthShell>
  );
}
