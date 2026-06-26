import type { LucideIcon } from "lucide-react";

type ComingSoonPanelProps = {
  badge: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export function ComingSoonPanel({
  badge,
  title,
  description,
  icon: Icon
}: ComingSoonPanelProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[var(--fitai-border)] bg-[linear-gradient(135deg,rgba(79,124,255,0.12),rgba(10,12,16,0.96)_42%,rgba(155,89,255,0.08))]">
      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.1fr)_260px] lg:p-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--fitai-primary)]">{badge}</p>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-[var(--fitai-text-primary)] md:text-3xl">{title}</h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--fitai-text-secondary)]">{description}</p>
          </div>
          <div className="rounded-2xl border border-[var(--fitai-border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[var(--fitai-text-secondary)]">
            Estamos ajustando essas experiencias para o fluxo do usuario final. Em breve essa area volta com uma
            navegacao mais simples e alinhada ao novo modelo do produto.
          </div>
        </div>

        <div className="flex items-center justify-start lg:justify-end">
          <div className="grid size-24 place-items-center rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(10,12,16,0.48)] text-[var(--fitai-primary)] shadow-[0_18px_48px_-30px_rgba(79,124,255,0.85)]">
            <Icon className="size-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
