import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <span className="mb-6 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-violet-700 shadow-sm dark:border-violet-800/60 dark:bg-violet-950/50 dark:text-violet-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Now live on campuses nationwide
        </span>

        <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
          Find your{" "}
          <span className="text-gradient">perfect roommate</span>
          <br />
          before move-in day
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-muted sm:text-xl">
          Swipe-worthy profiles, lifestyle quizzes, and vibe checks — so your dorm
          feels like home, not a random assignment.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/register" size="lg">
            Start matching free
          </Button>
          <Button href="/login" variant="secondary" size="lg">
            I already have an account
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted">
          Trusted by students at 200+ colleges · No credit card required
        </p>
      </div>

      <div className="relative mx-auto mt-16 max-w-lg animate-float">
        <div className="glass rounded-3xl p-6 shadow-2xl shadow-violet-500/10">
          <div className="flex items-center gap-4 border-b border-violet-100 pb-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-400 to-violet-500" />
            <div className="text-left">
              <p className="font-semibold">Maya · UCLA &apos;27</p>
              <p className="text-sm text-muted">Night owl · Clean freak · Plant mom</p>
            </div>
            <span className="ml-auto rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              94% match
            </span>
          </div>
          <p className="mt-4 text-left text-sm text-muted">
            &ldquo;Looking for someone who respects quiet hours but is down for late-night study snacks.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
