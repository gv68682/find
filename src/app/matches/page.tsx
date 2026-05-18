import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchUserProfile } from "@/lib/supabase/profile";
import { isProfileComplete, getAnonymousLabel } from "@/lib/profile";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Container } from "@/components/layout/Container";
import { MatchesList } from "@/components/matches/MatchesList";

export default async function MatchesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await fetchUserProfile(supabase, user.id);

  if (!isProfileComplete(profile)) {
    redirect("/onboarding");
  }

  return (
    <div className="gradient-mesh flex min-h-full flex-col">
      <DashboardHeader alias={getAnonymousLabel(user.id)} />
      <main className="flex-1 py-10 sm:py-14">
        <Container className="max-w-3xl">
          <div className="mb-10 animate-fade-in-up">
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
              Smart matches
            </h1>
            <p className="mt-2 text-muted">
              Top 5 roommates ranked by lifestyle fit (70%) and BGE-M3 cosine similarity (30%).
              No names or emails — anonymous only.
            </p>
          </div>
          <MatchesList />
        </Container>
      </main>
    </div>
  );
}
