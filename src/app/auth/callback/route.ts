import { createClient } from "@/lib/supabase/server";
import { fetchUserProfile } from "@/lib/supabase/profile";
import { getPostAuthPath } from "@/lib/profile";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (next && next.startsWith("/") && !next.startsWith("//")) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      if (user) {
        const profile = await fetchUserProfile(supabase, user.id);
        const path = getPostAuthPath(profile);
        return NextResponse.redirect(`${origin}${path}`);
      }

      return NextResponse.redirect(`${origin}/onboarding`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
