import { Navbar } from "@/components/layout/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="gradient-mesh flex min-h-full flex-col">
      <Navbar variant="minimal" />
      <main className="relative flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="absolute -right-16 bottom-1/4 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />
        </div>
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
