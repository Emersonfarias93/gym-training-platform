"use client";

import { AICoachPage } from "@/features/ai-coach/ai-coach-page";
import { AssessmentsPage } from "@/features/assessments/assessments-page";
import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { DietPage } from "@/features/diet/diet-page";
import { EvolutionPage } from "@/features/evolution/evolution-page";
import { SchedulePage } from "@/features/schedule/schedule-page";
import { SettingsPage } from "@/features/settings/settings-page";
import { TrainerPage } from "@/features/trainer/trainer-page";
import { WorkoutsPage } from "@/features/workouts/workouts-page";
import type { AppView } from "@/types/dashboard";

type AppViewProps = {
  view: AppView;
};

export function AppViewContent({ view }: AppViewProps) {
  switch (view) {
    case "workouts":
      return <WorkoutsPage />;
    case "diet":
      return <DietPage />;
    case "evolution":
      return <EvolutionPage />;
    case "assessments":
      return <AssessmentsPage />;
    case "ai-coach":
      return <AICoachPage />;
    case "schedule":
      return <SchedulePage />;
    case "trainer":
      return <TrainerPage />;
    case "settings":
      return <SettingsPage />;
    case "dashboard":
    default:
      return <DashboardPage />;
  }
}
