import { type SelectHTMLAttributes, forwardRef } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = "", id, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-foreground/80"
        >
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={`w-full appearance-none rounded-2xl border border-violet-100 bg-white/80 px-4 py-3 text-foreground outline-none transition duration-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 dark:border-violet-900/60 dark:bg-violet-950/30 ${error ? "border-rose-300" : ""} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-rose-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
