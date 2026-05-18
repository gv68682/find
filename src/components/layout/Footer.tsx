import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-violet-100/60 py-10">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Logo />
          <p className="text-center text-sm text-muted">
            © {new Date().getFullYear()} Find. Match your vibe, not your stress.
          </p>
        </div>
      </Container>
    </footer>
  );
}
