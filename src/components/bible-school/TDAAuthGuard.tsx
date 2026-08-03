// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA AUTH GUARD — Protects student portal pages (TFAM logo loading)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TDAAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("tda_student_session");

    if (!session) {
      router.push("/bible-school/login");
      return;
    }

    try {
      const parsed = JSON.parse(session);

      if (!parsed.id || !parsed.student_id || !parsed.email) {
        localStorage.removeItem("tda_student_session");
        router.push("/bible-school/login");
        return;
      }

      // Check if approved
      if (parsed.status !== "approved") {
        router.push("/bible-school/login");
        return;
      }

      setIsAuthenticated(true);
      setIsChecking(false);
    } catch (err) {
      console.error("Invalid session:", err);
      localStorage.removeItem("tda_student_session");
      router.push("/bible-school/login");
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <Image
              src="/images/logo/logo.png"
              alt="TFAM"
              width={80}
              height={80}
              unoptimized
              className="w-20 h-20 md:w-24 md:h-24 object-contain mx-auto animate-pulse drop-shadow-2xl"
              priority
            />
          </div>
          <p className="text-white font-black text-base md:text-lg mb-2">Triumphant Disciples Academy</p>
          <p className="text-brand-purple-200 font-semibold text-sm">Loading student portal...</p>
          <div className="mt-4 flex justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}