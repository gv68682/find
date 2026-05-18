import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";
import { Container } from "@/components/layout/Container";

export default function LandingPage() {
  return (
    <div className="gradient-mesh flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <Container>
          <Hero />
        </Container>
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
