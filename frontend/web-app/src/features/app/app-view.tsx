"use client";

import { AICoachPage } from "@/features/ai-coach/ai-coach-page";
import { AccountPage } from "@/features/account/account-page";
import { AssessmentsPage } from "@/features/assessments/assessments-page";
import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { DietPage } from "@/features/diet/diet-page";
import { EvolutionPage } from "@/features/evolution/evolution-page";
import { SchedulePage } from "@/features/schedule/schedule-page";
import { SettingsPage } from "@/features/settings/settings-page";
import { WorkoutsPage } from "@/features/workouts/workouts-page";
import type { AuthUser } from "@/types/auth";
import type { AppView } from "@/types/dashboard";

type AppViewProps = {
  user: AuthUser;
  view: AppView;
};

export function AppViewContent({ user, view }: AppViewProps) {
  switch (view) {
    case "workouts":
      return <WorkoutsPage user={user} />;
    case "diet":
      return <DietPage />;
    case "evolution":
      return <EvolutionPage />;
    case "assessments":
      return <AssessmentsPage />;
    case "ai-coach":
      return <AICoachPage user={user} />;
    case "schedule":
      return <SchedulePage />;
    case "account":
      return <AccountPage user={user} />;
    case "settings":
      return <SettingsPage />;
    case "dashboard":
    default:
      return <DashboardPage />;
  }
}
