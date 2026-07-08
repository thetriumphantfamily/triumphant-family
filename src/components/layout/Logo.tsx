// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOGO COMPONENT — REUSABLE + 3-CLICK ADMIN ACCESS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textColor?: "white" | "purple" | "gold";
  href?: string;
  className?: string;
}

export default function Logo({
  size = "md",
  showText = true,
  textColor = "white",
  href = "/",
  className,
}: LogoProps) {
  const router = useRouter();
  const clickCountRef = useRef(0);

  const sizes = {
    sm: { img: 80,  textMain: "text-lg",  textSub: "text-[10px]", gap: "gap-1" },
    md: { img: 120, textMain: "text-2xl", textSub: "text-xs",     gap: "gap-1" },
    lg: { img: 180, textMain: "text-3xl", textSub: "text-sm",     gap: "gap-2" },
    xl: { img: 240, textMain: "text-5xl", textSub: "text-lg",     gap: "gap-3" },
  };

  const colors = {
    white:  { main: "text-white",            sub: "text-brand-gold-300" },
    purple: { main: "text-brand-purple-900", sub: "text-brand-purple-600" },
    gold:   { main: "text-brand-gold-400",   sub: "text-brand-gold-300" },
  };

  const dimensions = sizes[size];
  const textStyles = colors[textColor];

  // ━━━ Click handler: count clicks, redirect on 3rd ━━━
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    clickCountRef.current += 1;

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      router.push("/admin/login");
    }
  };

  const content = (
    <div className={cn("flex items-center", dimensions.gap, className)}>
      {/* Logo Image */}
      <div className="relative flex-shrink-0 -mr-1">
        <Image
          src="/images/logo/logo.png"
          alt={`${SITE.name} Logo`}
          width={dimensions.img}
          height={dimensions.img}
          className="object-contain drop-shadow-lg"
          priority
          unoptimized
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className={cn(
              "font-heading font-bold tracking-tight",
              dimensions.textMain,
              textStyles.main
            )}
          >
            {SITE.name}
          </span>
          <span
            className={cn(
              "font-body font-black tracking-wider uppercase",
              dimensions.textSub,
              textStyles.sub
            )}
          >
            Apostolic Ministry
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className="inline-block hover:opacity-90 transition-opacity cursor-pointer"
      >
        {content}
      </a>
    );
  }

  return content;
}