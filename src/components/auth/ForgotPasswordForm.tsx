"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = new FormData(e.currentTarget).get("email") as string;
    const supabase = createClient();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  }

  return (
    <Card padding="lg" className="w-full max-w-md shadow-xl shadow-violet-500/5">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-lg text-white">
        ✉
      </div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
        Reset your password
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Enter the email you used to sign up. We&apos;ll send a secure link to choose a new password.
      </p>

      {sent ? (
        <div className="mt-8 space-y-4">
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
            If an account exists for that email, you&apos;ll receive reset instructions shortly.
          </p>
          <Button href="/login" variant="secondary" className="w-full" size="lg">
            Back to sign in
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input
            name="email"
            type="email"
            label="College email"
            placeholder="you@university.edu"
            autoComplete="email"
            required
          />

          {error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>

          <p className="text-center text-sm text-muted">
            <Link href="/login" className="font-semibold text-violet-600 hover:underline">
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </Card>
  );
}
