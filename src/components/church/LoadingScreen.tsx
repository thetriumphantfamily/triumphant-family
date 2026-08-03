// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHARED LOADING SCREEN — TFAM logo, all white text on dark background
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import Image from "next/image";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-4">
          <Image
            src="/images/logo/logo.png"
            alt="TFAM"
            width={64}
            height={64}
            unoptimized
            className="w-16 h-16 object-contain mx-auto animate-pulse drop-shadow-xl"
            priority
          />
        </div>
        <p className="text-white font-black text-sm mb-1">The Triumphant Family</p>
        <p className="text-white font-semibold text-xs">{message}</p>
        <div className="mt-3 flex justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}