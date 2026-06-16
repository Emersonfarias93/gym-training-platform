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
              <Badge className="border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                Athlete overview
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Painel premium para treino, nutricao e operacao da equipe.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)] md:text-base">
                Estrutura inspirada em um SaaS de alta densidade visual, com leituras compactas,
                contraste forte e destaque para o FitAI Coach.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
              <p className="text-sm text-[var(--muted-foreground)]">Atleta principal</p>
              <p className="mt-2 text-xl font-semibold text-white">Bianca S. Moreira</p>
              <p className="mt-1 text-sm text-emerald-300">Plano elite com acompanhamento diario</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {heroPills.map((item) => (
              <div key={item.label} className="rounded-[22px] border border-white/8 bg-black/20 p-4">
                <p className="text-sm text-[var(--muted-foreground)]">{item.label}</p>
                <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-white">Sinais de performance</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Resumo operacional com indicadores acionaveis para a equipe.
              </p>
            </div>
            <Sparkles className="size-5 text-emerald-300" />
          </div>

          <div className="mt-6 space-y-3">
            {performanceSignals.map((signal) => {
              const Icon = signal.icon;

              return (
                <div
                  key={signal.label}
                  className="flex items-center justify-between rounded-[22px] border border-white/8 bg-black/20 p-4"
                >
                  <span className="flex items-center gap-3 text-white">
                    <span className="rounded-2xl bg-white/5 p-3 text-emerald-300">
                      <Icon className="size-4" />
                    </span>
                    {signal.label}
                  </span>
                  <span className="text-sm text-[var(--muted-foreground)]">{signal.value}</span>
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
                <p className="text-lg font-semibold text-white">Sessoes em destaque</p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  O que vem pela frente com prioridade e intensidade.
                </p>
              </div>
              <Badge className="border-white/10 bg-white/5 text-white/70">Today stack</Badge>
            </div>
            <div className="mt-6 grid gap-4">
              {highlightSessions.map((session) => (
                <div
                  key={`${session.title}-${session.time}`}
                  className="rounded-[24px] border border-white/8 bg-black/20 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{session.title}</p>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        {session.coach} · {session.time}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
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
                <p className="text-lg font-semibold text-white">Acoes rapidas</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Fluxos usados com mais frequencia pela equipe.
                </p>
              </div>
              <Sparkles className="size-5 text-emerald-300" />
            </div>
            <div className="mt-6 grid gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.label}
                    className="flex items-center justify-between rounded-[22px] border border-white/8 bg-white/4 p-4 text-left transition-colors hover:bg-white/7"
                  >
                    <span className="flex items-center gap-3 text-white">
                      <span className="rounded-2xl bg-black/30 p-3">
                        <Icon className="size-4 text-emerald-300" />
                      </span>
                      {action.label}
                    </span>
                    <ArrowRight className="size-4 text-[var(--muted-foreground)]" />
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
