"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type DashboardHeaderProps = {
  alias: string;
};

export function DashboardHeader({ alias }: DashboardHeaderProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-violet-100/60 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo href="/dashboard" />
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden text-sm text-muted sm:inline">
            <span className="font-semibold text-foreground">{alias}</span>
          </span>
          <Button href="/matches" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Matches
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
