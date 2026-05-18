import type { PublicProfile } from "@/types/database";

type PublicProfileCardProps = {
  alias: string;
  profile: PublicProfile;
};

const GENDER_LABELS: Record<string, string> = {
  woman: "Woman",
  man: "Man",
  non_binary: "Non-binary",
  prefer_not: "Prefer not to say",
};

const SLEEP_LABELS: Record<string, string> = {
  early_bird: "Early bird",
  moderate: "Moderate",
  night_owl: "Night owl",
};

function levelBar(level: number | null) {
  if (level == null) return "—";
  return "●".repeat(level) + "○".repeat(5 - level);
}

export function PublicProfileCard({ alias, profile }: PublicProfileCardProps) {
  return (
    <article className="rounded-3xl border border-violet-100/80 bg-white/90 p-6 shadow-sm">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg font-bold">{alias}</p>
          <p className="text-sm text-muted">
            {profile.college_name} · {profile.major}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600">
          Anonymous
        </span>
      </header>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">Gender</dt>
          <dd className="font-medium">
            {profile.gender ? (GENDER_LABELS[profile.gender] ?? profile.gender) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Sleep</dt>
          <dd className="font-medium">
            {profile.sleep_schedule
              ? (SLEEP_LABELS[profile.sleep_schedule] ?? profile.sleep_schedule)
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Partying</dt>
          <dd className="font-medium tracking-widest">{levelBar(profile.partying_level)}</dd>
        </div>
        <div>
          <dt className="text-muted">Study focus</dt>
          <dd className="font-medium tracking-widest">{levelBar(profile.study_oriented_level)}</dd>
        </div>
        <div>
          <dt className="text-muted">Social</dt>
          <dd className="font-medium tracking-widest">{levelBar(profile.social_exposure_level)}</dd>
        </div>
        <div>
          <dt className="text-muted">Sports</dt>
          <dd className="font-medium">{profile.sports_interest ?? "—"}</dd>
        </div>
      </dl>

      {profile.hobbies.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.hobbies.map((hobby) => (
            <span
              key={hobby}
              className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
            >
              {hobby}
            </span>
          ))}
        </div>
      )}

      {profile.bio && (
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">{profile.bio}</p>
      )}
    </article>
  );
}
