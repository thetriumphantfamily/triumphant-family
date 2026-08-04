// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN SETTINGS PAGE — Manage site-wide configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/admin/Sidebar";
import SettingsManager from "@/components/admin/SettingsManager";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("key", { ascending: true });

  if (error) console.error("Error fetching settings:", error);

  const allSettings = settings || [];
  const liveSetting = allSettings.find((s) => s.key === "is_live_streaming");
  const isCurrentlyLive = liveSetting?.value === "true";

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900">
      <Sidebar />
      <div className="lg:ml-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 pt-20 lg:pt-8">

          {/* ━━━ HEADER CARD ━━━ */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl mb-6">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <div className="relative z-10">

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm mb-4">
                <Link href="/admin" className="text-brand-purple-200 hover:text-white font-semibold transition-colors">
                  Dashboard
                </Link>
                <svg className="w-4 h-4 text-brand-purple-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-brand-gold-400 font-semibold">Settings</span>
              </div>

              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
                    <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                    <span className="text-white font-semibold text-xs uppercase tracking-widest">
                      Site Settings
                    </span>
                  </div>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
                    Site Configuration ⚙️
                  </h1>
                  <p className="text-brand-purple-200 font-semibold">
                    Manage ministry information, live stream, and contact details
                  </p>
                </div>

                {/* Live Status Badge */}
                <div className={`px-5 py-3 rounded-2xl border-2 ${
                  isCurrentlyLive
                    ? "bg-red-500/20 border-red-400/40"
                    : "bg-brand-purple-950/60 border-brand-gold-400/40"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                      {isCurrentlyLive && (
                        <span className="absolute w-3 h-3 rounded-full bg-red-500 animate-ping" />
                      )}
                      <span className={`relative w-3 h-3 rounded-full ${isCurrentlyLive ? "bg-red-500" : "bg-brand-purple-300"}`} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest font-semibold text-brand-purple-200">Live Status</p>
                      <p className={`font-black ${isCurrentlyLive ? "text-red-400" : "text-white"}`}>
                        {isCurrentlyLive ? "🔴 LIVE NOW" : "⭕ Offline"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SettingsManager initialSettings={allSettings} />
        </div>
      </div>
    </div>
  );
}