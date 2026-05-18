import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type NavbarProps = {
  variant?: "landing" | "minimal";
};

export function Navbar({ variant = "landing" }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-violet-100/60 glass">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {variant === "landing" ? (
              <>
                <Button href="/login" variant="ghost" size="sm">
                  Log in
                </Button>
                <Button href="/register" size="sm">
                  Get started
                </Button>
              </>
            ) : (
              <Button href="/" variant="ghost" size="sm">
                Home
              </Button>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
}
