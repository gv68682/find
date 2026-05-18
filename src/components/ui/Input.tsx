import { type InputHTMLAttributes, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground/80"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-2xl border border-violet-100 bg-white/80 px-4 py-3 text-foreground placeholder:text-muted/60 outline-none transition duration-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 dark:border-violet-900/60 dark:bg-violet-950/30 dark:focus:border-violet-500 ${error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-400/20" : ""} ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-rose-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
