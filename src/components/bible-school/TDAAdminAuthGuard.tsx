// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN AUTH GUARD — Protects Bible School admin pages
// Redirects to unified /admin/login
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

  const checkAuth = async () => {
    try {
      const session = localStorage.getItem("tda_admin_session");

      if (!session) {
        router.push("/admin/login");
        return;
      }

      // Verify session hasn't expired (24 hours)
      const parsed = JSON.parse(session);
      const loggedInAt = new Date(parsed.loggedInAt);
      const now = new Date();
      const hoursDiff =
        (now.getTime() - loggedInAt.getTime()) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        localStorage.removeItem("tda_admin_session");
        router.push("/admin/login");
        return;
      }

      // Verify password is still valid in database
      const supabase = createClient();
      const { data } = await supabase
        .from("tda_settings")
        .select("setting_value")
        .eq("setting_key", "school_admin_password")
        .single();

      if (!data || data.setting_value !== parsed.password) {
        localStorage.removeItem("tda_admin_session");
        router.push("/admin/login");
        return;
      }

      setIsAuthenticated(true);
      setIsChecking(false);
    } catch (err) {
      console.error("Auth check error:", err);
      localStorage.removeItem("tda_admin_session");
      router.push("/admin/login");
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-4 animate-pulse">
            <svg
              className="w-8 h-8 text-brand-purple-900 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-white font-bold">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}