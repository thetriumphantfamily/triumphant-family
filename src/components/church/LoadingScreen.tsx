// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHARED LOADING SCREEN – TFAM logo, all white text on dark background
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import Image from "next/image";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900">
      <div className="text-center px-6">
        <div className="relative mb-4">
          <Image
            src="/images/logo/logo.png"
            alt="TFAM"
            width={80}
            height={80}
            unoptimized
            className="w-20 h-20 object-contain mx-auto animate-pulse drop-shadow-xl"
            priority
          />
        </div>
        <p className="text-white font-black text-base mb-1">
          The Triumphant Family
        </p>
        <p className="text-white font-semibold text-sm mb-3">{message}</p>
        <div className="flex justify-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-brand-gold-400 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-brand-gold-400 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-brand-gold-400 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}