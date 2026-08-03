// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN AUTH GUARD — Protects church admin pages (TFAM logo loading)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function ChurchAdminAuthGuard({
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

  const checkAuth = async () => {
    try {
      const session = localStorage.getItem("church_admin_session");

      if (!session) {
        router.push("/admin/login");
        return;
      }

      const parsed = JSON.parse(session);
      const loggedInAt = new Date(parsed.loggedInAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - loggedInAt.getTime()) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        localStorage.removeItem("church_admin_session");
        router.push("/admin/login");
        return;
      }

      const supabase = createClient();
      const { data } = await supabase
        .from("tfam_church_settings")
        .select("setting_value")
        .eq("setting_key", "church_admin_password")
        .single();

      if (!data || data.setting_value !== parsed.password) {
        localStorage.removeItem("church_admin_session");
        router.push("/admin/login");
        return;
      }

      setIsAuthenticated(true);
      setIsChecking(false);
    } catch (err) {
      console.error("Auth check error:", err);
      localStorage.removeItem("church_admin_session");
      router.push("/admin/login");
    }
  };

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
          <p className="text-white font-black text-base md:text-lg mb-2">The Triumphant Family</p>
          <p className="text-brand-purple-200 font-semibold text-sm">Verifying access...</p>
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