import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchUserProfile } from "@/lib/supabase/profile";
import { upsertProfileEmbedding } from "../../../lib/matching/embed-profile";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await fetchUserProfile(supabase, user.id);

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  await upsertProfileEmbedding(supabase, profile);

  return NextResponse.json({ ok: true });
}
