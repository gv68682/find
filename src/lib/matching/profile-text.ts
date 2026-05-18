import type { Profile } from "@/types/database";

const SLEEP: Record<string, string> = {
  early_bird: "early bird, prefers morning routine",
  night_owl: "night owl, active in late evenings",
  moderate: "flexible sleep schedule",
};

/** Lifestyle + personality text for BGE-M3 — no names, emails, or college identifiers */
export function profileToMatchingText(profile: Profile): string {
  const parts = [
    `Lifestyle and roommate preferences.`,
    `Sleep: ${SLEEP[profile.sleep_schedule ?? ""] ?? profile.sleep_schedule}.`,
    `Partying level ${profile.partying_level} of 5.`,
    `Study orientation ${profile.study_oriented_level} of 5.`,
    `Social exposure ${profile.social_exposure_level} of 5.`,
    `Sports and fitness: ${profile.sports_interest}.`,
    `Hobbies: ${profile.hobbies.join(", ")}.`,
    `Personality and living preferences: ${profile.bio}`,
    `Academic focus area: ${profile.major}.`,
  ];
  return parts.join(" ");
}
