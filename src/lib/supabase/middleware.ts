import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isProfileComplete } from "@/lib/profile";
import type { Profile } from "@/types/database";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const PROTECTED_PREFIXES = ["/dashboard", "/onboarding", "/discover", "/matches"];
const PROFILE_SELECT =
  "college_name, major, gender, sleep_schedule, partying_level, sports_interest, study_oriented_level, social_exposure_level, hobbies, bio, email";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isResetPassword = pathname.startsWith("/reset-password");
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isResetPassword && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "session");
    return NextResponse.redirect(url);
  }

  if (user && (isAuthRoute || isProtected)) {
    const { data: row } = await supabase
      .from("profiles")
      .select(PROFILE_SELECT)
      .eq("id", user.id)
      .single();

    const profile: Profile | null = row
      ? {
          id: user.id,
          ...row,
          hobbies: row.hobbies ?? [],
          created_at: "",
          updated_at: "",
        }
      : null;

    const complete = isProfileComplete(profile);

    if (isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = complete ? "/dashboard" : "/onboarding";
      return NextResponse.redirect(url);
    }

    if (
      (pathname.startsWith("/dashboard") ||
        pathname.startsWith("/discover") ||
        pathname.startsWith("/matches")) &&
      !complete
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
