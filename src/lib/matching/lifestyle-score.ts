import type { Profile } from "@/types/database";

export type LifestyleBreakdown = {
  sleep: number;
  partying: number;
  study: number;
  social: number;
  hobbies: number;
  sports: number;
  overall: number;
  reasons: string[];
};

function levelSimilarity(a: number | null, b: number | null): number {
  if (a == null || b == null) return 0;
  const diff = Math.abs(a - b);
  return Math.max(0, 1 - diff / 4);
}

function hobbyOverlap(a: string[], b: string[]): number {
  const setA = new Set(a.map((h) => h.toLowerCase().trim()));
  const shared = b.filter((h) => setA.has(h.toLowerCase().trim()));
  if (shared.length === 0) return 0;
  return Math.min(1, shared.length / Math.max(a.length, b.length, 1));
}

function sportsSimilarity(a: string | null, b: string | null): number {
  if (!a?.trim() || !b?.trim()) return 0.5;
  const ta = a.toLowerCase().split(/\W+/).filter(Boolean);
  const tb = b.toLowerCase().split(/\W+/).filter(Boolean);
  const shared = ta.filter((t) => tb.includes(t));
  return shared.length > 0 ? 0.7 : 0.3;
}

export function scoreLifestyle(user: Profile, candidate: Profile): LifestyleBreakdown {
  const reasons: string[] = [];

  let sleep = 0;
  if (user.sleep_schedule && user.sleep_schedule === candidate.sleep_schedule) {
    sleep = 1;
    reasons.push(
      user.sleep_schedule === "night_owl"
        ? "Both night owls — aligned sleep habits"
        : "Both early birds — aligned sleep habits"
    );
  } else if (user.sleep_schedule && candidate.sleep_schedule) {
    sleep = 0.25;
    reasons.push("Different sleep schedules — may need compromise");
  }

  const partying = levelSimilarity(user.partying_level, candidate.partying_level);
  if (partying >= 0.75) reasons.push("Similar partying preferences");
  else if (partying < 0.5) reasons.push("Partying levels differ — lifestyle gap");

  const study = levelSimilarity(user.study_oriented_level, candidate.study_oriented_level);
  if (study >= 0.75) reasons.push("Study habits align closely");
  else if (study >= 0.5) reasons.push("Moderately similar study focus");

  const social = levelSimilarity(user.social_exposure_level, candidate.social_exposure_level);
  if (social >= 0.75) reasons.push("Social energy levels match");
  else if (social >= 0.5) reasons.push("Comparable social exposure");

  const hobbies = hobbyOverlap(user.hobbies, candidate.hobbies);
  if (hobbies > 0) {
    const shared = user.hobbies.filter((h) =>
      candidate.hobbies.some((c) => c.toLowerCase() === h.toLowerCase())
    );
    reasons.push(`Shared hobbies: ${shared.slice(0, 3).join(", ")}`);
  }

  const sports = sportsSimilarity(user.sports_interest, candidate.sports_interest);
  if (sports >= 0.65) reasons.push("Similar sports and fitness interests");

  const overall =
    sleep * 0.25 +
    partying * 0.2 +
    study * 0.2 +
    social * 0.2 +
    hobbies * 0.1 +
    sports * 0.05;

  return { sleep, partying, study, social, hobbies, sports, overall, reasons };
}
