"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

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
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
      startTransition(() => {
        router.replace("/login");
        router.refresh();
      });
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
