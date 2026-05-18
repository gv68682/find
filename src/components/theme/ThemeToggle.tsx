"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-200/60 bg-white/50 text-sm transition duration-300 hover:bg-violet-50/80 dark:border-violet-800/60 dark:bg-violet-950/40 dark:hover:bg-violet-900/50"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
