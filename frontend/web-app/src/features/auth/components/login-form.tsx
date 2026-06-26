"use client";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";

import { login } from "@/services/auth/client";
import { loginSchema, type LoginFormValues } from "@/features/auth/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormStatus } from "@/features/auth/components/form-status";
import { PasswordInput } from "@/features/auth/components/password-input";
import { MOCK_AUTH_CREDENTIALS, MOCK_COMMON_CREDENTIALS } from "@/lib/mock-auth";

const demoAccounts = [
  { label: "Demo · plano ativo", credentials: MOCK_AUTH_CREDENTIALS },
  { label: "Comum", credentials: MOCK_COMMON_CREDENTIALS }
] as const;

export function LoginForm() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotHint, setShowForgotHint] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      setSuccessMessage("Login realizado. Redirecionando para o painel...");
      startTransition(() => {
        router.replace("/");
        router.refresh();
      });
    }
  });

  const isBusy = form.formState.isSubmitting || mutation.isPending;

  const onSubmit = form.handleSubmit(async (values) => {
    setSuccessMessage(null);
    await mutation.mutateAsync(values);
  });

  function fillDemo(credentials: { email: string; password: string }) {
    setSuccessMessage(null);
    mutation.reset();
    form.setValue("email", credentials.email, { shouldValidate: true });
    form.setValue("password", credentials.password, { shouldValidate: true });
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--fitai-text-primary)]" htmlFor="login-email">
          E-mail
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--fitai-text-muted)]" />
          <Input
            autoComplete="email"
            className="pl-11"
            id="login-email"
            placeholder="voce@fitai.com"
            type="email"
            {...form.register("email")}
          />
        </div>
        {form.formState.errors.email ? (
          <p className="text-sm text-[var(--fitai-danger)]">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-[var(--fitai-text-primary)]" htmlFor="login-password">
            Senha
          </label>
          <button
            className="text-sm text-[var(--fitai-primary)] transition-colors hover:text-white"
            onClick={() => setShowForgotHint((current) => !current)}
            type="button"
          >
            Esqueceu a senha?
          </button>
        </div>
        <PasswordInput
          autoComplete="current-password"
          id="login-password"
          placeholder="Digite sua senha"
          {...form.register("password")}
        />
        {showForgotHint ? (
          <p className="text-xs text-[var(--fitai-text-muted)]">
            Recuperacao de senha estara disponivel em breve.
          </p>
        ) : null}
        {form.formState.errors.password ? (
          <p className="text-sm text-[var(--fitai-danger)]">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      {mutation.isError ? (
        <FormStatus message="Login ou senha invalido." tone="error" />
      ) : null}

      {successMessage ? (
        <FormStatus message={successMessage} tone="success" />
      ) : null}

      {isBusy && !successMessage ? (
        <FormStatus message="Validando suas credenciais e preparando seu ambiente..." tone="loading" />
      ) : null}

      <Button className="w-full" disabled={isBusy} size="lg" type="submit">
        {isBusy ? <LoaderCircle className="size-4 animate-spin" /> : null}
        Entrar na plataforma
      </Button>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-[var(--fitai-border-subtle)]" />
        <span className="text-xs text-[var(--fitai-text-muted)]">ou entre com uma conta demo</span>
        <span className="h-px flex-1 bg-[var(--fitai-border-subtle)]" />
      </div>

      <div className="flex flex-wrap gap-2">
        {demoAccounts.map((account) => (
          <Button
            className="flex-1"
            key={account.label}
            onClick={() => fillDemo(account.credentials)}
            size="sm"
            type="button"
            variant="secondary"
          >
            {account.label}
          </Button>
        ))}
      </div>
    </form>
  );
}
