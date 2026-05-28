"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type ProfileFormProps = {
  userId: string;
  initialProfile: Profile | null;
};

const GENDER_OPTIONS = [
  { value: "woman", label: "Woman" },
  { value: "man", label: "Man" },
  { value: "non_binary", label: "Non-binary" },
  { value: "prefer_not", label: "Prefer not to say" },
];

const LEVEL_LABELS = ["Low", "Moderate", "Balanced", "High", "Very high"];

function LevelPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-foreground/80">{label}</legend>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`rounded-xl border py-2.5 text-sm font-semibold transition ${
              value === n
                ? "border-violet-500 bg-gradient-to-b from-violet-50 to-white text-violet-700 shadow-sm"
                : "border-violet-100 bg-white/80 text-muted hover:border-violet-200"
            }`}
            aria-pressed={value === n}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted">
        {value ? LEVEL_LABELS[value - 1] : "Tap a number from 1 (low) to 5 (high)"}
      </p>
    </fieldset>
  );
}

function SleepToggle({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "early_bird", label: "Early bird", desc: "Up early, quiet evenings" },
    { value: "night_owl", label: "Night owl", desc: "Late nights, slow mornings" },
  ] as const;

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-foreground/80">Night owl or early bird?</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-2xl border p-4 text-left transition ${
              value === opt.value
                ? "border-violet-500 bg-violet-50/80 ring-2 ring-violet-400/20"
                : "border-violet-100 bg-white/80 hover:border-violet-200"
            }`}
            aria-pressed={value === opt.value}
          >
            <span className="block font-semibold">{opt.label}</span>
            <span className="mt-1 block text-xs text-muted">{opt.desc}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function ProfileForm({ userId, initialProfile }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [collegeName, setCollegeName] = useState(initialProfile?.college_name ?? "");
  const [major, setMajor] = useState(initialProfile?.major ?? "");
  const [gender, setGender] = useState(initialProfile?.gender ?? "");
  const [sleepSchedule, setSleepSchedule] = useState(
    initialProfile?.sleep_schedule === "night_owl" ? "night_owl" : "early_bird"
  );
  const [partyingLevel, setPartyingLevel] = useState<number | null>(
    initialProfile?.partying_level ?? null
  );
  const [sportsInterest, setSportsInterest] = useState(initialProfile?.sports_interest ?? "");
  const [email, setEmail] = useState(initialProfile?.email ?? "");
  const [studyLevel, setStudyLevel] = useState<number | null>(
    initialProfile?.study_oriented_level ?? null
  );
  const [socialLevel, setSocialLevel] = useState<number | null>(
    initialProfile?.social_exposure_level ?? null
  );
  const [hobbiesRaw, setHobbiesRaw] = useState(initialProfile?.hobbies?.join(", ") ?? "");
  const [bio, setBio] = useState(initialProfile?.bio ?? "");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!partyingLevel || !studyLevel || !socialLevel || !gender) {
      setError("Please complete all fields.");
      setLoading(false);
      return;
    }

    const hobbies = hobbiesRaw
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    if (hobbies.length === 0) {
      setError("Add at least one hobby (comma-separated).");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const payload = {
      id: userId,
      college_name: collegeName.trim(),
      major: major.trim(),
      gender,
      sleep_schedule: sleepSchedule,
      partying_level: partyingLevel,
      sports_interest: sportsInterest.trim(),
      email: email.trim(),
      study_oriented_level: studyLevel,
      social_exposure_level: socialLevel,
      hobbies,
      bio: bio.trim(),
    };

    // Upsert: works whether signup trigger created a row or not (UPDATE alone silently no-ops if missing)
    const { data, error: saveError } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" })
      .select("id")
      .single();

    setLoading(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    if (!data) {
      setError("Profile could not be saved. Check RLS policies on public.profiles.");
      return;
    }

    // Generate and store embedding server-side (non-blocking — if it fails, matching still works)
    fetch("/api/embed-profile", { method: "POST" }).catch(() => null);

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card padding="lg" className="overflow-hidden">
        <div className="border-b border-violet-100/80 pb-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-600">
            Campus
          </span>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold">
            School & major & email
          </h2>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input
            name="college_name"
            label="College name"
            placeholder="State University"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            required
          />
          <Input
            name="major"
            label="Major"
            placeholder="Computer Science"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            required
          />
          <Input
            name="email"
            label="Email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={false}
          />
        </div>
      </Card>

      <Card padding="lg">
        <div className="border-b border-violet-100/80 pb-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-600">
            Lifestyle
          </span>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold">
            Daily habits
          </h2>
        </div>
        <div className="mt-6 space-y-8">
          <Select
            name="gender"
            label="Gender"
            placeholder="Select…"
            options={GENDER_OPTIONS}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          />
          <SleepToggle value={sleepSchedule} onChange={setSleepSchedule} />
          <LevelPicker label="Partying level" value={partyingLevel} onChange={setPartyingLevel} />
          <LevelPicker
            label="Study oriented level"
            value={studyLevel}
            onChange={setStudyLevel}
          />
          <LevelPicker
            label="Social exposure"
            value={socialLevel}
            onChange={setSocialLevel}
          />
          <Input
            name="sports_interest"
            label="Sports interest"
            placeholder="Soccer, gym, intramurals…"
            value={sportsInterest}
            onChange={(e) => setSportsInterest(e.target.value)}
            required
          />
        </div>
      </Card>

      <Card padding="lg">
        <div className="border-b border-violet-100/80 pb-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-600">
            About you
          </span>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold">
            Interests & bio
          </h2>
        </div>
        <div className="mt-6 space-y-4">
          <Input
            name="hobbies"
            label="Hobbies"
            placeholder="Reading, hiking, gaming (comma-separated)"
            value={hobbiesRaw}
            onChange={(e) => setHobbiesRaw(e.target.value)}
            required
          />
          <div className="space-y-1.5">
            <label htmlFor="bio" className="block text-sm font-medium text-foreground/80">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              maxLength={500}
              placeholder="What you're looking for in a roommate…"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              className="w-full resize-y rounded-2xl border border-violet-100 bg-white/80 px-4 py-3 text-foreground placeholder:text-muted/60 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
            />
            <p className="text-xs text-muted">{bio.length}/500 characters</p>
          </div>
        </div>
      </Card>

      {error && (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" className="w-full sm:w-auto" size="lg" disabled={loading}>
          {loading ? "Saving…" : "Save profile"}
        </Button>
        <p className="text-xs text-muted sm:ml-2">Saved securely to your account.</p>
      </div>
    </form>
  );
}
