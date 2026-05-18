"use client";

import { useMemo, useState } from "react";
import type { Profile } from "@/types/database";
import { isProfileComplete } from "@/lib/profile";
import { levelLabel } from "@/lib/profile-display";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { DiscoverProfileCard } from "@/components/discover/DiscoverProfileCard";

type DiscoverBrowseProps = {
  profiles: Profile[];
  currentUserId: string;
};

const ALL = "";

export function DiscoverBrowse({ profiles, currentUserId }: DiscoverBrowseProps) {
  const [college, setCollege] = useState(ALL);
  const [major, setMajor] = useState(ALL);
  const [sleep, setSleep] = useState(ALL);
  const [studyLevel, setStudyLevel] = useState(ALL);

  const completeProfiles = useMemo(
    () => profiles.filter((p) => p.id !== currentUserId && isProfileComplete(p)),
    [profiles, currentUserId]
  );

  const colleges = useMemo(
    () => [...new Set(completeProfiles.map((p) => p.college_name).filter(Boolean))] as string[],
    [completeProfiles]
  );
  const majors = useMemo(
    () => [...new Set(completeProfiles.map((p) => p.major).filter(Boolean))] as string[],
    [completeProfiles]
  );

  const filtered = useMemo(() => {
    return completeProfiles.filter((p) => {
      if (college && p.college_name !== college) return false;
      if (major && p.major !== major) return false;
      if (sleep && p.sleep_schedule !== sleep) return false;
      if (studyLevel && String(p.study_oriented_level) !== studyLevel) return false;
      return true;
    });
  }, [completeProfiles, college, major, sleep, studyLevel]);

  const sleepOptions = [
    { value: "early_bird", label: "Early bird" },
    { value: "night_owl", label: "Night owl" },
  ];

  const studyOptions = [1, 2, 3, 4, 5].map((n) => ({
    value: String(n),
    label: `Level ${n} — ${levelLabel(n)}`,
  }));

  function clearFilters() {
    setCollege(ALL);
    setMajor(ALL);
    setSleep(ALL);
    setStudyLevel(ALL);
  }

  const hasFilters = college || major || sleep || studyLevel;

  return (
    <div className="space-y-8">
      <Card padding="lg">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">Filters</h2>
        <p className="mt-1 text-sm text-muted">Narrow matches by campus and lifestyle.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="College"
            name="filter_college"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            placeholder="All colleges"
            options={[
              { value: ALL, label: "All colleges" },
              ...colleges.map((c) => ({ value: c, label: c })),
            ]}
          />
          <Select
            label="Major"
            name="filter_major"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            placeholder="All majors"
            options={[
              { value: ALL, label: "All majors" },
              ...majors.map((m) => ({ value: m, label: m })),
            ]}
          />
          <Select
            label="Sleep schedule"
            name="filter_sleep"
            value={sleep}
            onChange={(e) => setSleep(e.target.value)}
            placeholder="Any schedule"
            options={[{ value: ALL, label: "Any schedule" }, ...sleepOptions]}
          />
          <Select
            label="Study level"
            name="filter_study"
            value={studyLevel}
            onChange={(e) => setStudyLevel(e.target.value)}
            placeholder="Any level"
            options={[{ value: ALL, label: "Any level" }, ...studyOptions]}
          />
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 text-sm font-medium text-violet-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </Card>

      <p className="text-sm text-muted">
        {filtered.length} anonymous {filtered.length === 1 ? "profile" : "profiles"}
        {hasFilters ? " matching your filters" : ""}
      </p>

      {filtered.length === 0 ? (
        <Card className="text-center">
          <p className="text-muted">No profiles match these filters yet.</p>
        </Card>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((profile) => (
            <li key={profile.id}>
              <DiscoverProfileCard profile={profile} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
