import type { Profile } from "@/types/database";
import { getAnonymousLabel, isProfileComplete } from "@/lib/profile";
import { profileToMatchingText } from "@/lib/matching/profile-text";
import { embedWithBgeM3, getModelId } from "@/lib/matching/bge-m3";
import { cosineSimilarity, cosineToUnit } from "@/lib/matching/cosine";
import { scoreLifestyle } from "@/lib/matching/lifestyle-score";
import type { PublicProfile } from "@/types/database";
import type { SafeMatch } from "@/types/matching";

const LIFESTYLE_WEIGHT = 0.7;
const SEMANTIC_WEIGHT = 0.3;
const TOP_N = 5;

function toPublicProfile(profile: Profile): PublicProfile {
  return {
    college_name: profile.college_name,
    major: profile.major,
    email: profile.email,
    gender: profile.gender,
    sleep_schedule: profile.sleep_schedule,
    partying_level: profile.partying_level,
    sports_interest: profile.sports_interest,
    study_oriented_level: profile.study_oriented_level,
    social_exposure_level: profile.social_exposure_level,
    hobbies: profile.hobbies,
    bio: profile.bio,
  };
}

export async function findTopMatches(
  user: Profile,
  candidates: Profile[]
): Promise<SafeMatch[]> {
  const eligible = candidates.filter(
    (p) => p.id !== user.id && isProfileComplete(p)
  );

  if (eligible.length === 0) return [];

  const userText = profileToMatchingText(user);
  let userEmbedding: number[];

  try {
    userEmbedding = await embedWithBgeM3(userText);
  } catch {
    userEmbedding = [];
  }

  const candidateEmbeddings = await Promise.all(
    eligible.map(async (p) => {
      try {
        return await embedWithBgeM3(profileToMatchingText(p));
      } catch {
        return [] as number[];
      }
    })
  );

  const scored = eligible.map((candidate, index) => {
    const lifestyle = scoreLifestyle(user, candidate);
    let semantic = 0.5;

    if (userEmbedding.length > 0 && candidateEmbeddings[index]!.length > 0) {
      const cosine = cosineSimilarity(userEmbedding, candidateEmbeddings[index]!);
      semantic = cosineToUnit(cosine);
    }

    const combined =
      lifestyle.overall * LIFESTYLE_WEIGHT + semantic * SEMANTIC_WEIGHT;

    const reasons = [...lifestyle.reasons];

    if (userEmbedding.length > 0) {
      reasons.push(
        `${getModelId()} semantic similarity captures lifestyle, habits, and preference tone (cosine similarity, ${Math.round(semantic * 100)}% semantic fit)`
      );
    }

    reasons.unshift(
      `Overall score weights lifestyle habits ${Math.round(LIFESTYLE_WEIGHT * 100)}% over keyword overlap ${Math.round(SEMANTIC_WEIGHT * 100)}%`
    );

    return {
      candidate,
      combined,
      lifestyle: lifestyle.overall,
      semantic,
      reasons,
    };
  });

  scored.sort((a, b) => b.combined - a.combined);

  return scored.slice(0, TOP_N).map(({ candidate, combined, lifestyle, semantic, reasons }) => ({
    alias: getAnonymousLabel(candidate.id),
    compatibilityPercent: Math.round(combined * 100),
    lifestyleScore: Math.round(lifestyle * 100),
    semanticScore: Math.round(semantic * 100),
    reasons: reasons.slice(0, 5),
    profile: toPublicProfile(candidate),
  }));
}
