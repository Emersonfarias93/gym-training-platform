"use client";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { useId, useState } from "react";

import { Input } from "@/components/ui/input";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type">;

export function PasswordInput({
  autoComplete,
  id,
  placeholder,
  ...props
}: PasswordInputProps) {
  const generatedId = useId();
  const [isVisible, setIsVisible] = useState(false);
  const inputId = id ?? generatedId;

  return (
    <div className="relative">
      <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--fitai-text-muted)]" />
      <Input
        autoComplete={autoComplete}
        className="pl-11 pr-12"
        id={inputId}
        placeholder={placeholder}
        {...props}
        type={isVisible ? "text" : "password"}
      />
      <button
        aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
        className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-[var(--fitai-text-muted)] transition-colors hover:bg-[rgba(79,124,255,0.08)] hover:text-[var(--fitai-text-primary)]"
        onClick={() => setIsVisible((current) => !current)}
        type="button"
      >
        {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
