"use client";

import Link from "next/link";
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

const loginSignals = [
  "Use o e-mail cadastrado na sua conta FitAI.",
  "A sessao sera preparada antes de abrir o dashboard."
];

export function LoginForm() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="rounded-[28px] border border-[var(--fitai-border)] bg-[rgba(79,124,255,0.06)] p-4">
        <p className="text-sm font-medium text-[var(--fitai-text-primary)]">Entrada segura</p>
        <div className="mt-3 grid gap-2">
          {loginSignals.map((signal) => (
            <p className="text-sm leading-6 text-[var(--fitai-text-secondary)]" key={signal}>
              {signal}
            </p>
          ))}
        </div>
      </div>

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
        <p className="text-xs text-[var(--fitai-text-muted)]">Use o mesmo e-mail que foi registrado na plataforma.</p>
        {form.formState.errors.email ? (
          <p className="text-sm text-[var(--fitai-danger)]">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-[var(--fitai-text-primary)]" htmlFor="login-password">
            Senha
          </label>
          <Link className="text-sm text-[var(--fitai-primary)] hover:text-white" href="/register">
            Criar conta
          </Link>
        </div>
        <PasswordInput
          autoComplete="current-password"
          id="login-password"
          placeholder="Digite sua senha"
          {...form.register("password")}
        />
        <p className="text-xs text-[var(--fitai-text-muted)]">Mantenha sua senha em seguranca.</p>
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
    </form>
  );
}
