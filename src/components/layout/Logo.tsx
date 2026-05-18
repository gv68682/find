import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-lg font-bold text-white shadow-md shadow-violet-500/30 transition group-hover:scale-105">
        F
      </span>
      <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
        Find
      </span>
    </Link>
  );
}
