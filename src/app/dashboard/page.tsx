import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchUserProfile } from "@/lib/supabase/profile";
import { isProfileComplete, getAnonymousLabel } from "@/lib/profile";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PublicProfileCard } from "@/components/profile/PublicProfileCard";
import type { PublicProfile } from "@/types/database";

export default async function DashboardPage() {
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

  const alias = getAnonymousLabel(user.id);

  const publicProfile: PublicProfile = {
    college_name: profile!.college_name,
    major: profile!.major,
    email: profile!.email,
    gender: profile!.gender,
    sleep_schedule: profile!.sleep_schedule,
    partying_level: profile!.partying_level,
    sports_interest: profile!.sports_interest,
    study_oriented_level: profile!.study_oriented_level,
    social_exposure_level: profile!.social_exposure_level,
    hobbies: profile!.hobbies,
    bio: profile!.bio,
  };

  return (
    <div className="gradient-mesh flex min-h-full flex-col">
      <DashboardHeader alias={alias} />
      <main className="flex-1 py-10 sm:py-14">
        <Container>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
                Your dashboard
              </h1>
              <p className="mt-2 text-muted">
                You&apos;re set up as <span className="font-medium text-foreground">{alias}</span>.
                Matches only see your anonymous card below.
              </p>
            </div>
            <Button href="/onboarding" variant="secondary" size="sm">
              Edit profile
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-4 text-sm font-medium text-muted">How others see you</h2>
              <PublicProfileCard alias={alias} profile={publicProfile} />
            </div>

            <Card>
              <h2 className="font-semibold text-lg">Quick stats</h2>
              <div className="mt-6 space-y-4">
                <Stat label="AI matching" value="BGE-M3" />
                <Stat label="Top matches" value="5" />
              </div>
              <Button href="/matches" className="mt-6 w-full" size="sm">
                View smart matches
              </Button>
            </Card>
          </div>

          <Card className="mt-6 border-dashed border-violet-200 bg-violet-50/30">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">Explore matches</h2>
                <p className="mt-1 text-sm text-muted">
                  Browse anonymous roommate profiles at your school.
                </p>
              </div>
              <Button href="/discover" variant="secondary">
                Browse profiles
              </Button>
            </div>
          </Card>
        </Container>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-violet-50 pb-3 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-gradient">
        {value}
      </span>
    </div>
  );
}
