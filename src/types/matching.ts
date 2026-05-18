import type { PublicProfile } from "@/types/database";

export type SafeMatch = {
  alias: string;
  compatibilityPercent: number;
  lifestyleScore: number;
  semanticScore: number;
  reasons: string[];
  profile: PublicProfile;
};
