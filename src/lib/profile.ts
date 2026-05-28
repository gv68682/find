import type { Profile } from "@/types/database";

export function isProfileComplete(profile: Profile | null | undefined): boolean {
  if (!profile) return false;

  return Boolean(
    profile.college_name?.trim() &&
      profile.major?.trim() &&
      profile.gender?.trim() &&
      profile.sleep_schedule?.trim() &&
      profile.partying_level != null &&
      profile.sports_interest?.trim() &&
      profile.study_oriented_level != null &&
      profile.social_exposure_level != null &&
      profile.hobbies.length > 0 &&
      profile.bio?.trim()
  );
}

/** Anonymous label for UI — never derived from email or legal name */
export function getAnonymousLabel(userId: string): string {
  const segment = userId.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `Roommate #${segment}`;
}

export function getPostAuthPath(profile: Profile | null | undefined): "/dashboard" | "/onboarding" {
  return isProfileComplete(profile) ? "/dashboard" : "/onboarding";
}

export const PROFILE_FIELDS =
  "id, college_name, major, gender, sleep_schedule, partying_level, sports_interest, study_oriented_level, social_exposure_level, hobbies, bio, embedding, created_at, updated_at" as const;
