// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION HEADING — Consistent titles for page sections
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Alignment = "left" | "center" | "right";
type Theme     = "dark" | "light";

interface SectionHeadingProps {
  badge?:        string;
  title:         string | ReactNode;
  subtitle?:     string;
  align?:        Alignment;
  theme?:        Theme;
  className?:    string;
  withDivider?:  boolean;
}

export default function SectionHeading({
  badge,
  title,
  subtitle,
  align       = "center",
  theme       = "dark",
  className,
  withDivider = false,
}: SectionHeadingProps) {

  const alignStyles = {
    left:   "text-left items-start",
    center: "text-center items-center mx-auto",
    right:  "text-right items-end",
  };

  const titleColor    = theme === "dark" ? "text-brand-purple-900" : "text-white";
  const subtitleColor = theme === "dark" ? "text-gray-600"          : "text-brand-purple-100";

  return (
    <div className={cn("flex flex-col gap-3 max-w-3xl", alignStyles[align], className)}>

      {/* ━━━ Badge ━━━ */}
      {badge && (
        <div className="inline-block px-4 py-1.5 rounded-full bg-brand-gold-400/20 border border-brand-gold-400/40 mb-2">
          <span className="text-brand-gold-600 font-bold text-xs uppercase tracking-widest">
            {badge}
          </span>
        </div>
      )}

      {/* ━━━ Title ━━━ */}
      <h2 className={cn(
        "text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight tracking-tight",
        titleColor
      )}>
        {title}
      </h2>

      {/* ━━━ Divider ━━━ */}
      {withDivider && (
        <div className={cn(
          "h-1 w-20 rounded-full bg-gradient-gold my-2",
          align === "center" && "mx-auto"
        )}></div>
      )}

      {/* ━━━ Subtitle ━━━ */}
      {subtitle && (
        <p className={cn(
          "text-base md:text-lg leading-relaxed",
          subtitleColor
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}