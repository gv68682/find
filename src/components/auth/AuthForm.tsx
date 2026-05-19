"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getPostAuthPath } from "@/lib/profile";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isRegister = mode === "register";
  const redirectTo = searchParams.get("redirect");
  const authError = searchParams.get("error");

  const authErrorMessage =
    authError === "session"
      ? "Your session expired. Please sign in again."
      : authError === "auth"
        ? "Authentication failed. Please try again."
        : null;

  async function resolveDestination(userId: string) {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "college_name, major, gender, sleep_schedule, partying_level, sports_interest, study_oriented_level, social_exposure_level, hobbies, bio, email"
      )
      .eq("id", userId)
      .single();

    if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
      return redirectTo;
    }

    return getPostAuthPath(
      profile
        ? {
            id: userId,
            ...profile,
            hobbies: profile.hobbies ?? [],
            created_at: "",
            updated_at: "",
          }
        : null
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const supabase = createClient();

    if (isRegister) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        setMessage(
          "Check your college email for a confirmation link. After confirming, sign in to set up your profile."
        );
        setLoading(false);
        return;
      }

      const path = await resolveDestination(data.user!.id);
      router.push(path);
      router.refresh();
    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      const path = await resolveDestination(data.user.id);
      router.push(path);
      router.refresh();
    }
  }

  return (
    <Card padding="lg" className="w-full max-w-md shadow-xl shadow-violet-500/5">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-lg font-bold text-white">
        {isRegister ? "✦" : "→"}
      </div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
        {isRegister ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {isRegister
          ? "Sign up with your college email. Your identity stays private — only lifestyle details are shared with matches."
          : "Sign in to continue. Sessions stay secure on this device."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          name="email"
          type="email"
          label="College email"
          placeholder="you@university.edu"
          autoComplete="email"
          required
        />
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete={isRegister ? "new-password" : "current-password"}
          minLength={8}
          required
        />

        {!isRegister && (
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        )}

        {(error || (!isRegister && authErrorMessage)) && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600" role="alert">
            {error ?? authErrorMessage}
          </p>
        )}
        {message && (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
            {message}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Please wait…" : isRegister ? "Sign up" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-violet-600 hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/register" className="font-semibold text-violet-600 hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </Card>
  );
}
