import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchUserProfile } from "@/lib/supabase/profile";
import { isProfileComplete, getAnonymousLabel, PROFILE_FIELDS } from "@/lib/profile";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Container } from "@/components/layout/Container";
import { DiscoverBrowse } from "@/components/discover/DiscoverBrowse";
import type { Profile } from "@/types/database";

export default async function DiscoverPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const myProfile = await fetchUserProfile(supabase, user.id);

  if (!isProfileComplete(myProfile)) {
    redirect("/onboarding");
  }

  const { data: rows } = await supabase.from("profiles").select(PROFILE_FIELDS);

  const profiles = (rows ?? []) as Profile[];

  return (
    <div className="gradient-mesh flex min-h-full flex-col">
      <DashboardHeader alias={getAnonymousLabel(user.id)} />
      <main className="flex-1 py-10 sm:py-14">
        <Container>
          <div className="mb-10">
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
              Find roommates
            </h1>
            <p className="mt-2 max-w-xl text-muted">
              Browse anonymous profiles — only major, habits, interests, and bio are shown.
            </p>
          </div>
          <DiscoverBrowse profiles={profiles} currentUserId={user.id} />
        </Container>
      </main>
    </div>
  );
}
