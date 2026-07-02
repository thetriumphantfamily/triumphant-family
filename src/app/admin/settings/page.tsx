// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN SETTINGS PAGE — Manage site-wide configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/admin/Sidebar";
import SettingsManager from "@/components/admin/SettingsManager";

export default async function AdminSettingsPage() {
  // ━━━ AUTH PROTECTION ━━━
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // ━━━ Fetch all settings ━━━
  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("key", { ascending: true });

  if (error) {
    console.error("Error fetching settings:", error);
  }

  const allSettings = settings || [];

  // Check if currently live
  const liveSetting = allSettings.find((s) => s.key === "is_live_streaming");
  const isCurrentlyLive = liveSetting?.value === "true";

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8 pt-20 lg:pt-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Link href="/admin" className="hover:text-brand-purple-600">
                Dashboard
              </Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-brand-purple-600 font-semibold">Settings</span>
            </div>

            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-100 mb-3">
                  <span className="w-2 h-2 rounded-full bg-brand-purple-600 animate-pulse" />
                  <span className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest">
                    Site Settings
                  </span>
                </div>
                <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-brand-purple-900 mb-2">
                  Site{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                    Configuration ⚙️
                  </span>
                </h1>
                <p className="text-gray-500">
                  Manage ministry information, live stream, and contact details
                </p>
              </div>

              {/* Live status badge */}
              <div className={`px-5 py-3 rounded-2xl shadow-md border-2 ${
                isCurrentlyLive
                  ? "bg-red-50 border-red-300"
                  : "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    {isCurrentlyLive && (
                      <span className="absolute w-3 h-3 rounded-full bg-red-500 animate-ping" />
                    )}
                    <span className={`relative w-3 h-3 rounded-full ${
                      isCurrentlyLive ? "bg-red-500" : "bg-gray-400"
                    }`} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-gray-500">
                      Live Status
                    </p>
                    <p className={`font-bold ${
                      isCurrentlyLive ? "text-red-600" : "text-gray-600"
                    }`}>
                      {isCurrentlyLive ? "🔴 LIVE NOW" : "⭕ Offline"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Manager (client component) */}
          <SettingsManager initialSettings={allSettings} />
        </div>
      </div>
    </div>
  );
}