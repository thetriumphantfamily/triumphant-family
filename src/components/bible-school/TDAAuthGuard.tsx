// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA AUTH GUARD — Protects student portal pages
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TDAAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for student session in localStorage
    const session = localStorage.getItem("tda_student_session");

    if (!session) {
      // No session — redirect to login
      router.push("/bible-school/login");
      return;
    }

    try {
      const parsed = JSON.parse(session);

      // Verify session has required fields
      if (!parsed.id || !parsed.student_id || !parsed.email) {
        localStorage.removeItem("tda_student_session");
        router.push("/bible-school/login");
        return;
      }

      // Session valid
      setIsAuthenticated(true);
      setIsChecking(false);
    } catch (err) {
      console.error("Invalid session:", err);
      localStorage.removeItem("tda_student_session");
      router.push("/bible-school/login");
    }
  }, [router]);

  // Show loading state while checking
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
          <p className="text-white font-bold">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}