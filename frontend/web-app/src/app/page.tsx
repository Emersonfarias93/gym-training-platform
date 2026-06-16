import { AppShell } from "@/components/layout/app-shell";
import { AppViewContent } from "@/features/app/app-view";
import type { AppView } from "@/types/dashboard";

const validViews: AppView[] = [
  "dashboard",
  "workouts",
  "diet",
  "evolution",
  "assessments",
  "ai-coach",
  "schedule",
  "trainer",
  "settings"
];

type HomeProps = {
  searchParams: Promise<{
    view?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const activeView = validViews.includes(params.view as AppView)
    ? (params.view as AppView)
    : "dashboard";

  return (
    <AppShell activeView={activeView}>
      <AppViewContent view={activeView} />
    </AppShell>
  );
}
