// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOADING SPINNER — Spinning indicator for loading states
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { cn } from "@/lib/utils";

type SpinnerSize  = "sm" | "md" | "lg" | "xl";
type SpinnerColor = "purple" | "gold" | "white";

interface LoadingSpinnerProps {
  size?:       SpinnerSize;
  color?:      SpinnerColor;
  label?:      string;
  fullScreen?: boolean;
  className?:  string;
}

export default function LoadingSpinner({
  size       = "md",
  color      = "purple",
  label,
  fullScreen = false,
  className,
}: LoadingSpinnerProps) {

  const sizeStyles = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  const colorStyles = {
    purple: "border-brand-purple-200 border-t-brand-purple-600",
    gold:   "border-brand-gold-200 border-t-brand-gold-500",
    white:  "border-white/30 border-t-white",
  };

  const labelColorStyles = {
    purple: "text-brand-purple-700",
    gold:   "text-brand-gold-700",
    white:  "text-white",
  };

  const spinner = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "rounded-full animate-spin",
          sizeStyles[size],
          colorStyles[color]
        )}
        role="status"
        aria-label="Loading"
      />
      {label && (
        <p className={cn("text-sm font-medium animate-pulse", labelColorStyles[color])}>
          {label}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}