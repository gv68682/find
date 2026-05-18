import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";

export function CTA() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-500 to-cyan-500 px-8 py-16 text-center text-white shadow-2xl shadow-violet-500/30 sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wOCI+PHBhdGggIGQ9Ik0zNiAzNGg0djJoLTR6TTAgMzRoNHYyaC00ek0zNiAwaDR2NGgtNHpNMCAwaDR2NEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
          <h2 className="relative font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
            Ready to ditch the random roommate roulette?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-violet-100">
            Join thousands of students who found their people before freshman week.
          </p>
          <div className="relative mt-8">
            <Button
              href="/register"
              variant="secondary"
              size="lg"
              className="!bg-white !text-violet-700 !border-0 hover:!bg-violet-50"
            >
              Create your free profile
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
