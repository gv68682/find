"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getPostAuthPath } from "@/lib/profile";

export function ResetPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const password = form.get("password") as string;
    const confirm = form.get("confirmPassword") as string;

    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "college_name, major, gender, sleep_schedule, partying_level, sports_interest, study_oriented_level, social_exposure_level, hobbies, bio"
      )
      .eq("id", data.user.id)
      .single();

    const path = getPostAuthPath(
      profile
        ? {
            id: data.user.id,
            ...profile,
            hobbies: profile.hobbies ?? [],
            created_at: "",
            updated_at: "",
          }
        : null
    );

    router.push(path);
    router.refresh();
  }

  return (
    <Card padding="lg" className="w-full max-w-md shadow-xl shadow-violet-500/5">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-lg text-white">
        🔒
      </div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
        Choose a new password
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Use at least 8 characters. You&apos;ll stay signed in on this device after saving.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          name="password"
          type="password"
          label="New password"
          placeholder="••••••••"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <Input
          name="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="••••••••"
          autoComplete="new-password"
          minLength={8}
          required
        />

        {error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Saving…" : "Update password"}
        </Button>
      </form>
    </Card>
  );
}
