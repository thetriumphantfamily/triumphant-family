// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SELECT COMPONENT — Dropdown (WHITE LABEL)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?:       string;
  error?:       string;
  helperText?:  string;
  required?:    boolean;
  options:      SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  required,
  options,
  placeholder = "Select an option",
  className,
  id,
  ...props
}, ref) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {/* Label — now WHITE for visibility on purple */}
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-bold text-white mb-2"
        >
          {label}
          {required && <span className="text-brand-gold-400 ml-1">*</span>}
        </label>
      )}

      {/* Select Wrapper */}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          required={required}
          className={cn(
            "w-full px-4 py-3 pr-10 rounded-xl border-2 bg-white text-gray-900 transition-all duration-200 appearance-none cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-brand-gold-400",
            error
              ? "border-red-500 focus:border-red-500"
              : "border-brand-gold-400/40 focus:border-brand-gold-400",
            className
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown chevron */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {/* Error / Helper */}
      {error && (
        <p className="mt-1.5 text-sm text-red-300 flex items-center gap-1 font-semibold">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1.5 text-sm text-brand-purple-200">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;