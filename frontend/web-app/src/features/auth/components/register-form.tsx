"use client";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LoaderCircle, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormStatus } from "@/features/auth/components/form-status";
import { PasswordInput } from "@/features/auth/components/password-input";
import { register } from "@/services/auth/client";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schema";

export function RegisterForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    }
  });

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      setSuccessMessage("Conta criada com sucesso. Redirecionando para o painel...");
      // Navegacao "hard": requisicao nova ao servidor com o cookie de sessao,
      // evitando o cache de rota do App Router (que exigia um segundo clique).
      window.location.replace("/");
    }
  });

  const isBusy = form.formState.isSubmitting || mutation.isPending;
  const passwordValue = form.watch("password");
  const passwordChecks = [
    { label: "Minimo de 8 caracteres", done: passwordValue.length >= 8 },
    { label: "Letras e numeros", done: /[A-Za-z]/.test(passwordValue) && /\d/.test(passwordValue) }
  ];

  const onSubmit = form.handleSubmit(async (values) => {
    setSuccessMessage(null);
    await mutation.mutateAsync(values);
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--fitai-text-primary)]" htmlFor="register-name">
          Nome completo
        </label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--fitai-text-muted)]" />
          <Input
            autoComplete="name"
            className="pl-11"
            id="register-name"
            placeholder="Seu nome e sobrenome"
            {...form.register("fullName")}
          />
        </div>
        {form.formState.errors.fullName ? (
          <p className="text-sm text-[var(--fitai-danger)]">{form.formState.errors.fullName.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--fitai-text-primary)]" htmlFor="register-email">
          E-mail
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--fitai-text-muted)]" />
          <Input
            autoComplete="email"
            className="pl-11"
            id="register-email"
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
        <label className="text-sm font-medium text-[var(--fitai-text-primary)]" htmlFor="register-password">
          Senha
        </label>
        <PasswordInput
          autoComplete="new-password"
          id="register-password"
          placeholder="Minimo de 8 caracteres"
          {...form.register("password")}
        />
        {passwordValue ? (
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
            {passwordChecks.map((check) => (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs transition-colors",
                  check.done ? "text-[var(--fitai-success)]" : "text-[var(--fitai-text-muted)]"
                )}
                key={check.label}
              >
                <Check className="size-3.5" />
                {check.label}
              </span>
            ))}
          </div>
        ) : null}
        {form.formState.errors.password ? (
          <p className="text-sm text-[var(--fitai-danger)]">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      {mutation.isError ? (
        <FormStatus message={mutation.error.message} tone="error" />
      ) : null}

      {successMessage ? (
        <FormStatus message={successMessage} tone="success" />
      ) : null}

      {isBusy && !successMessage ? (
        <FormStatus message="Criando sua conta e configurando a sessao inicial..." tone="loading" />
      ) : null}

      <Button className="w-full" disabled={isBusy} size="lg" type="submit">
        {isBusy ? <LoaderCircle className="size-4 animate-spin" /> : null}
        Criar conta
      </Button>
    </form>
  );
}
