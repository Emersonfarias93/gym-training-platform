"use client";

import {
  Bot,
  Crown,
  LockKeyhole,
  LoaderCircle,
  Send
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { CheckoutDialog } from "@/features/checkout/checkout-dialog";
import { getUserInitials, hasActivePlan } from "@/lib/auth";
import {
  createAiCoachMessage,
  formatMessageTime,
  initialAiCoachMessage,
  quickPrompts
} from "@/lib/ai-coach";
import { cn } from "@/lib/utils";
import { sendAiCoachMessage } from "@/services/llm/client";
import type { AiCoachMessage } from "@/types/ai-coach";
import type { AuthUser } from "@/types/auth";

type AICoachPageProps = {
  user: AuthUser;
};

function renderMessageContent(content: string) {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => (
      <p className="whitespace-pre-wrap" key={index}>
        {line}
      </p>
    ));
}

function AiCoachUpgradeState() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="mx-auto grid min-h-[calc(100dvh-10rem)] max-w-4xl place-items-center rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-bg-shell)] p-6 lg:min-h-[calc(100dvh-8rem)]">
      <div className="max-w-xl text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl fitai-ai-gradient text-white">
          <LockKeyhole className="size-6" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--fitai-primary)]">
          Plano ativo
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-normal text-[var(--fitai-text-primary)]">
          AI Coach disponivel para usuarios com plano ativo
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--fitai-text-secondary)]">
          Converse sobre sua rotina, tire dúvidas e explore ajustes no seu planejamento com o plano Premium.
        </p>
        <Button className="mt-6" onClick={() => setCheckoutOpen(true)}>
          <Crown className="size-4" />
          Ativar plano
        </Button>
      </div>
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  );
}

export function AICoachPage({ user }: AICoachPageProps) {
  const [messages, setMessages] = useState<AiCoachMessage[]>([initialAiCoachMessage]);
  const [draft, setDraft] = useState("");
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  const canUseAiCoach = hasActivePlan(user);

  const mutation = useMutation({
    mutationFn: sendAiCoachMessage,
    onSuccess: (response) => {
      setLastFailedMessage(null);
      setMessages((current) => [...current, response.message]);
    },
    onError: (_error, variables) => {
      setLastFailedMessage(variables.message);
      setMessages((current) =>
        current.map((message) =>
          message.id === variables.history.at(-1)?.id ? { ...message, status: "error" } : message
        )
      );
    }
  });

  const isThinking = mutation.isPending;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isThinking]);

  if (!canUseAiCoach) {
    return <AiCoachUpgradeState />;
  }

  function sendMessage(content: string) {
    const trimmedContent = content.trim();

    if (!trimmedContent || isThinking) {
      return;
    }

    const userMessage = createAiCoachMessage("user", trimmedContent);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setDraft("");
    startTransition(() => {
      mutation.mutate({
        message: trimmedContent,
        history: nextMessages
      });
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(draft);
  }

  function retryLastMessage() {
    if (!lastFailedMessage || isThinking) {
      return;
    }

    const retryMessage = createAiCoachMessage("user", lastFailedMessage);
    const retryHistory = [...messages.filter((message) => message.status !== "error"), retryMessage];

    setMessages(retryHistory);
    setLastFailedMessage(null);
    mutation.mutate({
      message: lastFailedMessage,
      history: retryHistory
    });
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-10rem)] max-w-4xl flex-col overflow-hidden rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-bg-shell)] lg:min-h-[calc(100dvh-8rem)]">
      <header className="flex items-center justify-between border-b border-[var(--fitai-border)] bg-[var(--fitai-bg-shell)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-2xl fitai-ai-gradient text-white">
            <Bot className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--fitai-text-primary)]">FitAI Coach</h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-[var(--fitai-success)]">
              <span className="size-1.5 rounded-full bg-[var(--fitai-success)]" />
              Assistente de treino com IA
            </p>
          </div>
        </div>
      </header>

      <section role="log" aria-label="Conversa com o coach" aria-live="polite" className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
        {messages.map((message) => {
          const isUser = message.author === "user";

          return (
            <div
              className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
              key={message.id}
            >
              {!isUser ? (
                <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-2xl fitai-ai-gradient text-white">
                  <Bot className="size-4" />
                </div>
              ) : null}

              <div className={cn("min-w-0 max-w-[85%] break-words", isUser ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "text-sm leading-6",
                    isUser
                      ? "rounded-[20px] rounded-br-md bg-[var(--fitai-primary)] px-4 py-3 text-white"
                      : "rounded-[20px] rounded-tl-md border border-[var(--fitai-border-strong)] bg-[var(--fitai-surface)] px-4 py-3 text-[var(--fitai-text-primary)]",
                    message.status === "error" &&
                      "border border-[rgba(255,107,107,0.22)] bg-[rgba(255,107,107,0.10)] text-[var(--fitai-danger)]"
                  )}
                >
                  <div className="space-y-3">
                    {renderMessageContent(
                      message.status === "error"
                        ? "Nao consegui enviar essa mensagem. Tente novamente em instantes."
                        : message.content
                    )}
                  </div>
                </div>
                <div
                  className={cn(
                    "mt-2 flex items-center gap-3 text-[11px] text-[var(--fitai-text-muted)]",
                    isUser ? "justify-end" : "justify-start"
                  )}
                >
                  {message.id !== "welcome" ? <span>{formatMessageTime(message.createdAt)}</span> : null}

                </div>
              </div>

              {isUser ? (
                <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-2xl bg-[var(--fitai-success)] text-xs font-bold text-white">
                  {getUserInitials(user.fullName)}
                </div>
              ) : null}
            </div>
          );
        })}

        {isThinking ? (
          <div className="flex justify-start gap-3">
            <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-2xl fitai-ai-gradient text-white">
              <Bot className="size-4" />
            </div>
            <div className="rounded-[20px] rounded-tl-md border border-[var(--fitai-border-strong)] bg-[var(--fitai-surface)] px-4 py-3 text-sm text-[var(--fitai-text-secondary)]">
              <span className="inline-flex items-center gap-2">
                <LoaderCircle className="size-4 animate-spin text-[var(--fitai-primary)]" />
                FitAI analisando contexto...
              </span>
            </div>
          </div>
        ) : null}

        {mutation.isError ? (
          <div className="rounded-2xl border border-[rgba(255,107,107,0.18)] bg-[rgba(255,107,107,0.08)] p-4 text-sm text-[var(--fitai-danger)]">
            <p>{mutation.error.message}</p>
            {lastFailedMessage ? (
              <button
                className="mt-3 rounded-full border border-[rgba(255,107,107,0.28)] px-3 py-1.5 font-semibold transition-colors hover:bg-[rgba(255,107,107,0.08)]"
                onClick={retryLastMessage}
                type="button"
              >
                Tentar novamente
              </button>
            ) : null}
          </div>
        ) : null}

        <div ref={scrollRef} />
      </section>

      <footer className="sticky bottom-0 border-t border-[var(--fitai-border)] bg-[var(--fitai-surface)] px-4 pb-4 pt-3 backdrop-blur-xl">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {quickPrompts.map((prompt) => (
            <button
              className="shrink-0 rounded-full border border-[rgba(50,107,77,0.28)] bg-[rgba(50,107,77,0.08)] px-3 py-2 text-xs font-medium text-[var(--fitai-primary)] transition-colors hover:bg-[rgba(50,107,77,0.14)] disabled:opacity-50"
              disabled={isThinking}
              key={prompt}
              onClick={() => sendMessage(prompt)}
              type="button"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form
          className="flex min-h-14 items-center gap-3 rounded-2xl border border-[var(--fitai-border-strong)] bg-[var(--fitai-surface)] px-3 py-2"
          onSubmit={handleSubmit}
        >
          <input
            aria-label="Mensagem para o FitAI Coach"
            className="min-w-0 flex-1 bg-transparent text-sm text-[var(--fitai-text-primary)] outline-none placeholder:text-[var(--fitai-text-muted)]"
            disabled={isThinking}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Pergunte ao FitAI Coach..."
            type="text"
            value={draft}
          />
          <button
            aria-label="Enviar mensagem"
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-full transition-colors",
              draft.trim() && !isThinking
                ? "fitai-primary-gradient text-white"
                : "bg-[var(--fitai-surface-secondary)] text-[var(--fitai-text-secondary)]"
            )}
            disabled={!draft.trim() || isThinking}
            type="submit"
          >
            {isThinking ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
          </button>
        </form>
      </footer>
    </div>
  );
}
