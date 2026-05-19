import type { DiscoverableProfile } from "@/lib/profile-display";
import { formatHabits, formatInterests } from "@/lib/profile-display";

type DiscoverProfileCardProps = {
  profile: DiscoverableProfile;
};

export function DiscoverProfileCard({ profile }: DiscoverProfileCardProps) {
  const habits = formatHabits(profile);
  const interests = formatInterests(profile);

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-violet-100/80 bg-white/90 p-6 shadow-sm transition duration-300 hover:border-violet-200 hover:shadow-md hover:shadow-violet-500/10 dark:border-violet-900/50 dark:bg-violet-950/20 dark:hover:border-violet-700">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-[family-name:var(--font-display)] text-xl font-bold text-gradient">
            {profile.major}
          </p>
          <p className="font-[family-name:var(--font-display)] text-xl font-bold text-gradient">
            ({profile.email ?? "Anonymous"})
          </p>
          <span className="mt-1 inline-block rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-600">
            Anonymous
          </span>
        </div>
      </header>
      <section className="mt-auto border-t border-violet-50 pt-4">
        
      </section>
      <section className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Habits</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {habits.map((habit) => (
            <li
              key={habit}
              className="rounded-full border border-violet-100 bg-violet-50/50 px-3 py-1 text-xs font-medium text-foreground/80"
            >
              {habit}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Interests</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {interests.map((item) => (
            <li
              key={item}
              className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-800"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {profile.bio && (
        <section className="mt-auto border-t border-violet-50 pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Bio</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{profile.bio}</p>
        </section>
      )}
    </article>
  );
}
