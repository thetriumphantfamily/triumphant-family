// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN AUTH GUARD – Protects Bible School admin (TFAM logo loading)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TDAAdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const session = localStorage.getItem("tda_admin_session");

      if (!session) {
        router.push("/admin/login");
        return;
      }

      const parsed = JSON.parse(session);

      // ✅ Check session exists and has required fields
      if (!parsed.password || !parsed.loggedInAt) {
        localStorage.removeItem("tda_admin_session");
        router.push("/admin/login");
        return;
      }

      // ✅ Check session expiry (24 hours)
      const loggedInAt = new Date(parsed.loggedInAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - loggedInAt.getTime()) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        localStorage.removeItem("tda_admin_session");
        router.push("/admin/login");
        return;
      }

      // ✅ Session is valid — no DB check needed
      // The password was already verified at login time
      setIsAuthenticated(true);
      setIsChecking(false);

    } catch (err) {
      console.error("Auth check error:", err);
      localStorage.removeItem("tda_admin_session");
      router.push("/admin/login");
    }
  };

  // Still checking
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
          <p className="text-white font-black text-base md:text-lg mb-2">
            Triumphant Disciples Academy
          </p>
          <p className="text-brand-purple-200 font-semibold text-sm">
            Verifying admin access...
          </p>
          <div className="mt-4 flex justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) return null;

  // ✅ Authenticated — show children
  return <>{children}</>;
}