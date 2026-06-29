// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUTTON COMPONENT — 5 VARIANTS + 3 SIZES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "gold" | "outline" | "ghost" | "danger";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:    ButtonVariant;
  size?:       ButtonSize;
  href?:       string;
  isLoading?:  boolean;
  fullWidth?:  boolean;
  leftIcon?:   ReactNode;
  rightIcon?:  ReactNode;
  children:    ReactNode;
}

export default function Button({
  variant   = "primary",
  size      = "md",
  href,
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {

  // ━━━ Base styles ━━━
  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // ━━━ Size styles ━━━
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // ━━━ Variant styles ━━━
  const variantStyles = {
    primary: "bg-brand-purple-600 text-white shadow-brand hover:bg-brand-purple-700 hover:shadow-brand-lg focus:ring-brand-purple-400",
    gold:    "bg-gradient-gold text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 focus:ring-brand-gold-300",
    outline: "bg-transparent text-brand-purple-600 border-2 border-brand-purple-600 hover:bg-brand-purple-600 hover:text-white focus:ring-brand-purple-400",
    ghost:   "bg-transparent text-brand-purple-600 hover:bg-brand-purple-50 focus:ring-brand-purple-400",
    danger:  "bg-red-600 text-white shadow-md hover:bg-red-700 focus:ring-red-400",
  };

  // ━━━ Combine all styles ━━━
  const buttonClass = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    fullWidth && "w-full",
    className
  );

  // ━━━ Inner content ━━━
  const content = (
    <>
      {isLoading ? (
        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </>
  );

  // ━━━ Render as Link if href provided ━━━
  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={buttonClass}>
        {content}
      </Link>
    );
  }

  // ━━━ Render as regular button ━━━
  return (
    <button
      className={buttonClass}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  );
}