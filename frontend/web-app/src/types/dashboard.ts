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

export type PageIntro = {
  eyebrow: string;
  title: string;
  description: string;
  filters: string[];
};
