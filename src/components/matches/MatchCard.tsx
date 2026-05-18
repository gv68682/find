import type { SafeMatch } from "@/types/matching";
import { DiscoverProfileCard } from "@/components/discover/DiscoverProfileCard";

type MatchCardProps = {
  match: SafeMatch;
  rank: number;
};

export function MatchCard({ match, rank }: MatchCardProps) {
  return (
    <div className="glass animate-fade-in-up rounded-3xl p-6 transition duration-300 hover:shadow-lg hover:shadow-violet-500/10">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            #{rank} match
          </span>
          <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold">
            {match.alias}
          </p>
        </div>
        <div className="text-right">
          <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-gradient">
            {match.compatibilityPercent}%
          </p>
          <p className="text-xs text-muted">compatibility</p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-violet-50/80 px-3 py-2 dark:bg-violet-950/40">
          <p className="text-xs text-muted">Lifestyle</p>
          <p className="font-semibold">{match.lifestyleScore}%</p>
        </div>
        <div className="rounded-2xl bg-cyan-50/80 px-3 py-2 dark:bg-cyan-950/40">
          <p className="text-xs text-muted">BGE-M3 semantic</p>
          <p className="font-semibold">{match.semanticScore}%</p>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Why you matched
        </h3>
        <ul className="mt-2 space-y-1.5">
          {match.reasons.map((reason) => (
            <li key={reason} className="flex gap-2 text-sm text-foreground/85">
              <span className="text-violet-500">•</span>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <DiscoverProfileCard profile={match.profile} />
    </div>
  );
}
