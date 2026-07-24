// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TEXTAREA COMPONENT — Multi-line input (WHITE LABEL)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:        string;
  error?:        string;
  helperText?:   string;
  required?:     boolean;
  showCount?:    boolean;
  currentValue?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  required,
  showCount,
  currentValue = "",
  maxLength,
  className,
  id,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const charCount  = currentValue?.length || 0;

  return (
    <div className="w-full">
      {/* Label — now WHITE for visibility on purple */}
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-bold text-white mb-2"
        >
          {label}
          {required && <span className="text-brand-gold-400 ml-1">*</span>}
        </label>
      )}

      {/* Textarea */}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        required={required}
        maxLength={maxLength}
        className={cn(
          "w-full px-4 py-3 rounded-xl border-2 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200 resize-none",
          "focus:outline-none focus:ring-2 focus:ring-brand-gold-400",
          error
            ? "border-red-500 focus:border-red-500"
            : "border-brand-gold-400/40 focus:border-brand-gold-400",
          className
        )}
        {...props}
      />

      {/* Footer Row */}
      <div className="mt-1.5 flex items-start justify-between gap-2">
        <div className="flex-1">
          {error && (
            <p className="text-sm text-red-300 flex items-center gap-1 font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </p>
          )}

          {helperText && !error && (
            <p className="text-sm text-brand-purple-200">{helperText}</p>
          )}
        </div>

        {showCount && maxLength && (
          <p className={cn(
            "text-xs flex-shrink-0",
            charCount > maxLength * 0.9 ? "text-brand-gold-400 font-bold" : "text-brand-purple-200"
          )}>
            {charCount} / {maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;