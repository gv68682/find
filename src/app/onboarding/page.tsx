import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchUserProfile } from "@/lib/supabase/profile";
import { isProfileComplete, getAnonymousLabel } from "@/lib/profile";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Container } from "@/components/layout/Container";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await fetchUserProfile(supabase, user.id);
  const alias = getAnonymousLabel(user.id);
  const isEditing = isProfileComplete(profile);

  return (
    <div className="gradient-mesh flex min-h-full flex-col">
      <DashboardHeader alias={alias} />
      <main className="flex-1 py-10 sm:py-14">
        <Container className="max-w-2xl">
          <div className="mb-10">
            <p className="text-sm font-medium text-violet-600">
              {isEditing ? "Edit profile" : "Profile setup"}
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
              {isEditing ? "Update your profile" : "Set up your profile"}
            </h1>
            <p className="mt-2 text-muted">
              {isEditing
                ? "Changes update your anonymous match card. Your email and name stay private."
                : "Tell us about your lifestyle so we can match you with compatible roommates. Your email and name are never shown."}
            </p>
          </div>
          <ProfileForm userId={user.id} initialProfile={profile} />
        </Container>
      </main>
    </div>
  );
}
