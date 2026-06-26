import type { LucideIcon } from "lucide-react";

export type AppView =
  | "dashboard"
  | "workouts"
  | "diet"
  | "evolution"
  | "ai-coach"
  | "account"
  | "settings";

export type NavItem = {
  id: AppView;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

export type Metric = {
  label: string;
  value: string;
  delta: string;
  helper: string;
  trend: "up" | "down";
};

export type Session = {
  title: string;
  time: string;
  source: string;
  status: "Hoje" | "A seguir" | "Recuperacao";
};

export type Insight = {
  title: string;
  body: string;
};

export type PageIntro = {
  eyebrow: string;
  title: string;
  description: string;
  filters: string[];
};
