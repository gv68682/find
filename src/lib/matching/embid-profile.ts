import { embedText } from "@/lib/matching/minilm";
import { profileToMatchingText } from "@/lib/matching/profile-text";
import type { Profile } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Call this whenever a user saves/updates their profile.
 * Generates a MiniLM embedding and stores it in profiles.embedding.
 * /api/matches then reads it directly — no model needed at match time.
 */
export async function upsertProfileEmbedding(
  supabase: SupabaseClient,
  profile: Profile
): Promise<void> {
  try {
    const text = profileToMatchingText(profile);
    const embedding = await embedText(text);

    await supabase
      .from("profiles")
      .update({ embedding })
      .eq("id", profile.id);
  } catch (err) {
    // Non-fatal — matching falls back to lifestyle score only
    console.error("Failed to generate profile embedding:", err);
  }
}
