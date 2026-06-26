"use client";

import { useMutation } from "@tanstack/react-query";
import { LoaderCircle, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/services/auth/client";

type LogoutButtonProps = {
  className?: string;
  label?: string;
  variant?: "ghost" | "secondary";
};

export function LogoutButton({
  className,
  label = "Sair",
  variant = "ghost"
}: LogoutButtonProps) {
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Navegacao "hard" para garantir estado deslogado limpo (sem cache de rota).
      window.location.replace("/login");
    }
  });

  return (
    <Button
      className={cn("justify-center", className)}
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
      type="button"
      variant={variant}
    >
      {mutation.isPending ? <LoaderCircle className="size-4 animate-spin" /> : <LogOut className="size-4" />}
      {label}
    </Button>
  );
}
