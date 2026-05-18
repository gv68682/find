"use client";

import { useEffect, useState } from "react";
import type { SafeMatch } from "@/types/matching";
import { MatchCard } from "@/components/matches/MatchCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function MatchesList() {
  const [matches, setMatches] = useState<SafeMatch[]>([]);
  const [method, setMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadMatches() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/matches");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to load matches");
        setMatches([]);
        return;
      }
      setMatches(data.matches ?? []);
      setMethod(data.method ?? null);
    } catch {
      setError("Could not reach matching service.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMatches();
  }, []);

  if (loading) {
    return (
      <Card className="animate-pulse text-center">
        <p className="text-muted">Running BGE-M3 embeddings and lifestyle scoring…</p>
        <p className="mt-2 text-xs text-muted">First load may take a minute while the model downloads.</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="text-center">
        <p className="text-rose-600">{error}</p>
        <Button className="mt-4" size="sm" variant="secondary" onClick={loadMatches}>
          Retry
        </Button>
      </Card>
    );
  }

  if (matches.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-muted">No matches yet. More complete profiles on your campus will appear here.</p>
        <Button href="/discover" className="mt-4" size="sm" variant="secondary">
          Browse profiles
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {method && (
        <Card padding="sm" className="border-violet-200/60 bg-violet-50/30 dark:bg-violet-950/20">
          <p className="text-sm text-muted">
            <span className="font-semibold text-foreground">Matching logic:</span> {method}
          </p>
        </Card>
      )}
      <ul className="space-y-8">
        {matches.map((match, i) => (
          <li key={match.alias} style={{ animationDelay: `${i * 80}ms` }}>
            <MatchCard match={match} rank={i + 1} />
          </li>
        ))}
      </ul>
    </div>
  );
}
