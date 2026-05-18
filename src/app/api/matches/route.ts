import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchUserProfile } from "@/lib/supabase/profile";
import { isProfileComplete, PROFILE_FIELDS } from "@/lib/profile";
import { findTopMatches } from "@/lib/matching/engine";
import type { Profile } from "@/types/database";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const myProfile = await fetchUserProfile(supabase, user.id);

  if (!isProfileComplete(myProfile)) {
    return NextResponse.json({ error: "Complete your profile first" }, { status: 400 });
  }

  const { data: rows } = await supabase.from("profiles").select(PROFILE_FIELDS);
  const candidates = (rows ?? []) as Profile[];

  const matches = await findTopMatches(myProfile!, candidates);

  return NextResponse.json({
    matches,
    model: "BGE-M3",
    method: "70% lifestyle alignment + 30% cosine similarity on BGE-M3 embeddings",
  });
}
