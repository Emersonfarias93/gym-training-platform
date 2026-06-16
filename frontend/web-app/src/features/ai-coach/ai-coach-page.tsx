import {
  Bot,
  Copy,
  ImageIcon,
  MoreHorizontal,
  Paperclip,
  Send,
  ThumbsDown,
  ThumbsUp
} from "lucide-react";

const quickPrompts = [
  "Criar plano semanal",
  "Analise calorica",
  "Dica de hoje",
  "Tecnicas avancadas"
];

const messages = [
  {
    id: "welcome",
    author: "ai",
    time: "08:00",
    content: (
      <>
        <p>
          Ola! Sou o <strong>FitAI Coach</strong> - seu personal trainer com IA.
        </p>
        <p>Tenho acesso ao seu historico completo de treinos, dieta e evolucao.</p>
        <p>Como posso te ajudar hoje?</p>
      </>
    )
  },
  {
    id: "user-question",
    author: "user",
    time: "08:02",
    content: "Meu treino de peito parou de progredir. O que fazer?"
  },
  {
    id: "analysis",
    author: "ai",
    time: "08:02",
    content: (
      <>
        <p>Entendo a frustracao. Aqui estao as causas e solucoes:</p>
        <div className="space-y-2">
          <p>
            <strong>1. Sobrecarga Progressiva</strong>
            <br />
            Aumentar peso ou reps toda semana?
          </p>
          <p>
            <strong>2. Variacao de Estimulos</strong>
            <br />
            Supino pegada fechada
            <br />
            Crossover no cabo
            <br />
            Flexao com pes elevados
          </p>
          <p>
            <strong>3. Volume</strong>
            <br />
            Treinar peito 2x semana com 16-20 series totais
          </p>
        </div>
        <p>Quer que eu monte um treino especifico?</p>
      </>
    )
  }
];

export function AICoachPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-10rem)] max-w-4xl flex-col overflow-hidden rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-bg-shell)] lg:min-h-[calc(100dvh-8rem)]">
      <header className="flex items-center justify-between border-b border-[var(--fitai-border)] bg-[var(--fitai-bg-shell)] px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            aria-label="Abrir conversas"
            className="grid size-9 place-items-center rounded-2xl bg-[var(--fitai-surface-elevated)] text-[var(--fitai-text-secondary)]"
            type="button"
          >
            <Bot className="size-4" />
          </button>
          <div className="grid size-9 place-items-center rounded-2xl fitai-ai-gradient text-white">
            <Bot className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--fitai-text-primary)]">FitAI Coach</h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-[var(--fitai-success)]">
              <span className="size-1.5 rounded-full bg-[var(--fitai-success)]" />
              Online · GPT-4o
            </p>
          </div>
        </div>
        <button
          aria-label="Mais opcoes do chat"
          className="grid size-9 place-items-center rounded-2xl text-[var(--fitai-text-secondary)]"
          type="button"
        >
          <MoreHorizontal className="size-5" />
        </button>
      </header>

      <section className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
        {messages.map((message) => {
          const isUser = message.author === "user";

          return (
            <div
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              key={message.id}
            >
              {!isUser ? (
                <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-2xl fitai-ai-gradient text-white">
                  <Bot className="size-4" />
                </div>
              ) : null}

              <div className={`max-w-[82%] ${isUser ? "items-end" : "items-start"}`}>
                <div
                  className={
                    isUser
                      ? "rounded-[20px] rounded-br-md bg-[var(--fitai-primary)] px-4 py-3 text-sm leading-6 text-white"
                      : "rounded-[20px] rounded-tl-md border border-[var(--fitai-border-strong)] bg-[var(--fitai-surface)] px-4 py-3 text-sm leading-6 text-[var(--fitai-text-primary)]"
                  }
                >
                  <div className="space-y-3">{message.content}</div>
                </div>
                <div
                  className={`mt-2 flex items-center gap-3 text-[11px] text-[var(--fitai-text-muted)] ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <span>{message.time}</span>
                  {!isUser ? (
                    <>
                      <Copy className="size-3.5" />
                      <ThumbsUp className="size-3.5" />
                      <ThumbsDown className="size-3.5" />
                    </>
                  ) : null}
                </div>
              </div>

              {isUser ? (
                <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-2xl bg-[var(--fitai-success)] text-xs font-bold text-white">
                  RM
                </div>
              ) : null}
            </div>
          );
        })}
      </section>

      <footer className="sticky bottom-0 border-t border-[var(--fitai-border)] bg-[linear-gradient(180deg,rgba(10,12,16,0.75),var(--fitai-bg-shell))] px-4 pb-4 pt-3 backdrop-blur-xl">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {quickPrompts.map((prompt) => (
            <button
              className="shrink-0 rounded-full border border-[rgba(79,124,255,0.28)] bg-[rgba(79,124,255,0.08)] px-3 py-2 text-xs font-medium text-[var(--fitai-primary)]"
              key={prompt}
              type="button"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="flex min-h-14 items-center gap-3 rounded-2xl border border-[var(--fitai-border-strong)] bg-[var(--fitai-surface)] px-3 py-2">
          <button
            aria-label="Anexar imagem"
            className="grid size-9 shrink-0 place-items-center rounded-full text-[var(--fitai-text-secondary)]"
            type="button"
          >
            <ImageIcon className="size-5" />
          </button>
          <button
            aria-label="Anexar arquivo"
            className="grid size-9 shrink-0 place-items-center rounded-full text-[var(--fitai-text-secondary)]"
            type="button"
          >
            <Paperclip className="size-5" />
          </button>
          <input
            aria-label="Mensagem para o FitAI Coach"
            className="min-w-0 flex-1 bg-transparent text-sm text-[var(--fitai-text-primary)] outline-none placeholder:text-[var(--fitai-text-muted)]"
            placeholder="Pergunte ao FitAI Coach..."
            type="text"
          />
          <button
            aria-label="Enviar mensagem"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--fitai-surface-secondary)] text-[var(--fitai-text-secondary)]"
            type="button"
          >
            <Send className="size-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
