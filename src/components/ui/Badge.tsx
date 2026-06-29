// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BADGE COMPONENT — Pill labels for categories, tags, status
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "purple" | "gold" | "green" | "red" | "blue" | "gray" | "outline";
type BadgeSize    = "sm" | "md" | "lg";

interface BadgeProps {
  variant?:   BadgeVariant;
  size?:      BadgeSize;
  className?: string;
  children:   ReactNode;
}

export default function Badge({
  variant = "purple",
  size    = "md",
  className,
  children,
}: BadgeProps) {

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const variantStyles = {
    purple:  "bg-brand-purple-100 text-brand-purple-800",
    gold:    "bg-brand-gold-100 text-brand-gold-800",
    green:   "bg-green-100 text-green-800",
    red:     "bg-red-100 text-red-800",
    blue:    "bg-blue-100 text-blue-800",
    gray:    "bg-gray-100 text-gray-700",
    outline: "bg-transparent border border-brand-purple-300 text-brand-purple-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}