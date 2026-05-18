import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-violet-600 via-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]",
  secondary:
    "bg-surface/80 text-foreground border border-violet-200/80 hover:border-violet-300 hover:bg-violet-50/50 dark:border-violet-800/60 dark:hover:bg-violet-950/50",
  ghost:
    "text-muted hover:text-foreground hover:bg-violet-50/60 dark:hover:bg-violet-950/40",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-2.5 text-sm rounded-2xl",
  lg: "px-8 py-3.5 text-base rounded-2xl",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = BaseProps & {
  href: string;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  ...props
}: ButtonProps | LinkProps) {
  const classes = `inline-flex items-center justify-center font-semibold transition-all duration-300 ease-out disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
