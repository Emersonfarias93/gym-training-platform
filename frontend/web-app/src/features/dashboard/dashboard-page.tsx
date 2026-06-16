"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ActivityChart } from "@/features/dashboard/components/activity-chart";
import { CoachPanel } from "@/features/dashboard/components/coach-panel";
import { FocusCard } from "@/features/dashboard/components/focus-card";
import { MetricCard } from "@/features/dashboard/components/metric-card";
import { NutritionCard } from "@/features/dashboard/components/nutrition-card";
import { ScheduleList } from "@/features/dashboard/components/schedule-list";
import {
  focusAreas,
  heroPills,
  highlightSessions,
  insights,
  metrics,
  nextSessions,
  performanceSignals,
  quickActions,
  weeklyLoad
} from "@/features/dashboard/data";

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: index * 0.06 }
  })
};

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <motion.section
        initial="hidden"
        animate="visible"
        custom={0}
        variants={reveal}
        className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]"
      >
        <Card className="overflow-hidden p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <Badge>
                Athlete overview
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[var(--fitai-text-primary)] md:text-4xl">
                Painel premium para treino, nutricao e operacao da equipe.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--fitai-text-secondary)] md:text-base">
                Estrutura inspirada em um SaaS de alta densidade visual, com leituras compactas,
                contraste forte e destaque para o FitAI Coach.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-5">
              <p className="text-sm text-[var(--fitai-text-secondary)]">Atleta principal</p>
              <p className="mt-2 text-xl font-semibold text-[var(--fitai-text-primary)]">Bianca S. Moreira</p>
              <p className="mt-1 text-sm text-[var(--fitai-success)]">Plano elite com acompanhamento diario</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {heroPills.map((item) => (
              <div key={item.label} className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-4">
                <p className="text-sm text-[var(--fitai-text-secondary)]">{item.label}</p>
                <p className="mt-2 text-xl font-semibold text-[var(--fitai-text-primary)]">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-[var(--fitai-text-primary)]">Sinais de performance</p>
              <p className="mt-2 text-sm leading-6 text-[var(--fitai-text-secondary)]">
                Resumo operacional com indicadores acionaveis para a equipe.
              </p>
            </div>
            <Sparkles className="size-5 text-[var(--fitai-primary)]" />
          </div>

          <div className="mt-6 space-y-3">
            {performanceSignals.map((signal) => {
              const Icon = signal.icon;

              return (
                <div
                  key={signal.label}
                  className="flex items-center justify-between rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-4"
                >
                  <span className="flex items-center gap-3 text-[var(--fitai-text-primary)]">
                    <span className="rounded-2xl bg-[rgba(79,124,255,0.10)] p-3 text-[var(--fitai-primary)]">
                      <Icon className="size-4" />
                    </span>
                    {signal.label}
                  </span>
                  <span className="text-sm text-[var(--fitai-text-secondary)]">{signal.value}</span>
                </div>
              );
            })}
          </div>

          <Button variant="secondary" className="mt-6 w-full">
            Ver recomendacoes
          </Button>
        </Card>
      </motion.section>

      <motion.section
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric, index) => (
          <motion.div key={metric.label} custom={index + 1} variants={reveal}>
            <MetricCard metric={metric} />
          </motion.div>
        ))}
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
        <motion.div initial="hidden" animate="visible" custom={5} variants={reveal}>
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-[var(--fitai-text-primary)]">Sessoes em destaque</p>
                <p className="mt-2 text-sm text-[var(--fitai-text-secondary)]">
                  O que vem pela frente com prioridade e intensidade.
                </p>
              </div>
              <Badge className="border-[var(--fitai-border)] bg-[var(--fitai-surface-secondary)] text-[var(--fitai-text-secondary)]">Today stack</Badge>
            </div>
            <div className="mt-6 grid gap-4">
              {highlightSessions.map((session) => (
                <div
                  key={`${session.title}-${session.time}`}
                  className="rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-[var(--fitai-text-primary)]">{session.title}</p>
                      <p className="mt-1 text-sm text-[var(--fitai-text-secondary)]">
                        {session.coach} · {session.time}
                      </p>
                    </div>
                    <span className="rounded-full border border-[var(--fitai-border)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--fitai-text-secondary)]">
                      {session.intensity}
                    </span>
                  </div>
                  <Progress value={session.completion} className="mt-4 h-2.5" />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
        <motion.div initial="hidden" animate="visible" custom={6} variants={reveal}>
          <CoachPanel insights={insights} />
        </motion.div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_420px]">
        <motion.div initial="hidden" animate="visible" custom={7} variants={reveal}>
          <ActivityChart values={weeklyLoad} />
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          custom={8}
          variants={reveal}
          className="space-y-6"
        >
          <Card className="overflow-hidden p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-[var(--fitai-text-primary)]">Acoes rapidas</p>
                <p className="text-sm text-[var(--fitai-text-secondary)]">
                  Fluxos usados com mais frequencia pela equipe.
                </p>
              </div>
              <Sparkles className="size-5 text-[var(--fitai-primary)]" />
            </div>
            <div className="mt-6 grid gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.label}
                    className="flex items-center justify-between rounded-2xl border border-[var(--fitai-border)] bg-[var(--fitai-surface-elevated)] p-4 text-left transition-colors hover:bg-[var(--fitai-surface-secondary)]"
                  >
                    <span className="flex items-center gap-3 text-[var(--fitai-text-primary)]">
                      <span className="rounded-2xl bg-[rgba(79,124,255,0.10)] p-3">
                        <Icon className="size-4 text-[var(--fitai-primary)]" />
                      </span>
                      {action.label}
                    </span>
                    <ArrowRight className="size-4 text-[var(--fitai-text-secondary)]" />
                  </button>
                );
              })}
            </div>
          </Card>
          <FocusCard items={focusAreas} />
        </motion.div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <motion.div initial="hidden" animate="visible" custom={9} variants={reveal}>
          <ScheduleList sessions={nextSessions} />
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          custom={10}
          variants={reveal}
          className="space-y-6"
        >
          <NutritionCard />
        </motion.div>
      </section>
    </div>
  );
}
