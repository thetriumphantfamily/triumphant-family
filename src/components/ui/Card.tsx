// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CARD COMPONENT — Reusable card with hover effects
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "elevated" | "outlined" | "gradient";

interface CardProps {
  variant?:     CardVariant;
  href?:        string;
  hoverable?:   boolean;
  className?:   string;
  children:     ReactNode;
}

export default function Card({
  variant   = "default",
  href,
  hoverable = false,
  className,
  children,
}: CardProps) {

  const baseStyles = "rounded-2xl overflow-hidden transition-all duration-300";

  const variantStyles = {
    default:  "bg-white shadow-md",
    elevated: "bg-white shadow-lg",
    outlined: "bg-white border-2 border-brand-purple-100",
    gradient: "bg-gradient-to-br from-brand-purple-600 to-brand-purple-800 text-white shadow-brand-lg",
  };

  const hoverStyles = hoverable
    ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    : "";

  const cardClass = cn(
    baseStyles,
    variantStyles[variant],
    hoverStyles,
    className
  );

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {children}
      </Link>
    );
  }

  return <div className={cardClass}>{children}</div>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CARD SUB-COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-6 pb-3", className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-6 pt-3", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-6 pt-3 border-t border-gray-100", className)}>{children}</div>;
}

export function CardImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn("relative w-full aspect-video bg-gray-100 overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
    </div>
  );
}