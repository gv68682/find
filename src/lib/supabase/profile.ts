import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";
import { PROFILE_FIELDS } from "@/lib/profile";

export async function fetchUserProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select(PROFILE_FIELDS)
    .eq("id", userId)
    .single<Profile>();

  return data ?? null;
}
