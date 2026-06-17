"use client";

import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormStatus } from "@/features/auth/components/form-status";
import { PasswordInput } from "@/features/auth/components/password-input";
import { register } from "@/services/auth/client";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schema";

const passwordRules = [
  "Minimo de 8 caracteres",
  "Use uma combinacao forte para proteger sua conta",
  "O papel inicial sera criado como USER"
];

export function RegisterForm() {
  const router = useRouter();
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
      startTransition(() => {
        router.replace("/");
        router.refresh();
      });
    }
  });

  const isBusy = form.formState.isSubmitting || mutation.isPending;
  const passwordValue = form.watch("password");
  const completedRules = [
    passwordValue.length >= 8,
    /[A-Za-z]/.test(passwordValue) && /\d/.test(passwordValue),
    true
  ];

  const onSubmit = form.handleSubmit(async (values) => {
    setSuccessMessage(null);
    await mutation.mutateAsync({
      ...values,
      role: "USER"
    });
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="rounded-[28px] border border-[var(--fitai-border)] bg-[rgba(79,124,255,0.06)] p-4">
        <p className="text-sm font-medium text-[var(--fitai-text-primary)]">Primeiro acesso</p>
        <div className="mt-3 grid gap-2">
          {passwordRules.map((rule, index) => (
            <div className="flex items-center gap-2" key={rule}>
              <span
                className={`size-2 rounded-full ${completedRules[index] ? "bg-[var(--fitai-success)]" : "bg-[var(--fitai-text-muted)]"}`}
              />
              <p className="text-sm leading-6 text-[var(--fitai-text-secondary)]">{rule}</p>
            </div>
          ))}
        </div>
      </div>

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
        <p className="text-xs text-[var(--fitai-text-muted)]">Esse nome sera exibido na sidebar e no menu mobile.</p>
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
        <p className="text-xs text-[var(--fitai-text-muted)]">Use um e-mail unico para evitar conflito no cadastro.</p>
        {form.formState.errors.email ? (
          <p className="text-sm text-[var(--fitai-danger)]">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-[var(--fitai-text-primary)]" htmlFor="register-password">
            Senha
          </label>
          <Link className="text-sm text-[var(--fitai-primary)] hover:text-white" href="/login">
            Ja tenho conta
          </Link>
        </div>
        <PasswordInput
          autoComplete="new-password"
          id="register-password"
          placeholder="Minimo de 8 caracteres"
          {...form.register("password")}
        />
        <p className="text-xs text-[var(--fitai-text-muted)]">Combine letras e numeros para uma senha mais forte.</p>
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
