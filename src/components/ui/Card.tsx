import { type ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
};

const paddingMap = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ children, className = "", padding = "md" }: CardProps) {
  return (
    <div
      className={`glass rounded-3xl shadow-xl shadow-violet-500/5 transition duration-300 hover:shadow-violet-500/10 dark:shadow-violet-900/20 ${paddingMap[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
