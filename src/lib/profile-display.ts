import type { Profile, PublicProfile } from "@/types/database";

export function sleepLabel(schedule: string | null): string {
  if (schedule === "night_owl") return "Night owl";
  if (schedule === "early_bird") return "Early bird";
  if (schedule === "moderate") return "Moderate";
  return "—";
}

export function levelLabel(level: number | null): string {
  if (level == null) return "—";
  const labels = ["Very low", "Low", "Moderate", "High", "Very high"];
  return labels[level - 1] ?? String(level);
}

export function formatHabits(
  profile: Pick<
    Profile,
    "sleep_schedule" | "partying_level" | "study_oriented_level" | "social_exposure_level"
  >
): string[] {
  return [
    sleepLabel(profile.sleep_schedule),
    `Partying: ${levelLabel(profile.partying_level)}`,
    `Study: ${levelLabel(profile.study_oriented_level)}`,
    `Social: ${levelLabel(profile.social_exposure_level)}`,
  ];
}

export function formatInterests(profile: Pick<Profile, "sports_interest" | "hobbies">): string[] {
  const items: string[] = [];
  if (profile.sports_interest?.trim()) items.push(profile.sports_interest.trim());
  return [...items, ...(profile.hobbies ?? [])];
}

export type DiscoverableProfile = PublicProfile;
