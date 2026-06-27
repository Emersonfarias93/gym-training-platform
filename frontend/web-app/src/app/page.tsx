import { AppShell } from "@/components/layout/app-shell";
import { AppViewContent } from "@/features/app/app-view";
import { getServerAuthSession } from "@/services/auth/server";
import type { AppView } from "@/types/dashboard";
import { redirect } from "next/navigation";

const validViews: AppView[] = [
  "dashboard",
  "workouts",
  "diet",
  "evolution",
  "ai-coach",
  "account"
];

type HomeProps = {
  searchParams: Promise<{
    view?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const activeView = validViews.includes(params.view as AppView)
    ? (params.view as AppView)
    : "dashboard";

  return (
    <AppShell activeView={activeView} user={session.user}>
      <AppViewContent user={session.user} view={activeView} />
    </AppShell>
  );
}
