// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN ANALYTICS PAGE — Website visitor tracking
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/admin/Sidebar";
import SiteAnalyticsClient from "@/components/admin/SiteAnalyticsClient";

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Fetch all visits
  const { data: visits } = await supabase
    .from("website_visits")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);

  const allVisits = visits || [];

  // Server-side calculations
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000);

  const todayCount = allVisits.filter((v) => new Date(v.created_at) >= todayStart).length;
  const weekCount = allVisits.filter((v) => new Date(v.created_at) >= weekStart).length;
  const monthCount = allVisits.filter((v) => new Date(v.created_at) >= monthStart).length;
  const liveCount = allVisits.filter((v) => new Date(v.created_at) >= fiveMinsAgo).length;

  // Top pages
  const pageCounts: Record<string, number> = {};
  allVisits.forEach((v) => {
    pageCounts[v.page] = (pageCounts[v.page] || 0) + 1;
  });
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Device breakdown
  const deviceCounts: Record<string, number> = {};
  allVisits.forEach((v) => {
    const d = v.device || "unknown";
    deviceCounts[d] = (deviceCounts[d] || 0) + 1;
  });

  // Country breakdown
  const countryCounts: Record<string, number> = {};
  allVisits.forEach((v) => {
    const c = v.country || "unknown";
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Daily chart (last 14 days)
  const dailyData: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const day = new Date(todayStart);
    day.setDate(day.getDate() - i);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    const count = allVisits.filter((v) => {
      const d = new Date(v.created_at);
      return d >= day && d < nextDay;
    }).length;
    dailyData.push({
      date: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count,
    });
  }

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
                <span className="text-brand-gold-400 font-semibold">Analytics</span>
              </div>

              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
                    <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                    <span className="text-white font-semibold text-xs uppercase tracking-widest">
                      Visitor Tracking
                    </span>
                  </div>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
                    Website Analytics 📊
                  </h1>
                  <p className="text-brand-purple-200 font-semibold">
                    Track who visits your website and which pages they view
                  </p>
                </div>

                {/* Live visitors */}
                <div className={`px-5 py-3 rounded-2xl border-2 ${liveCount > 0 ? "bg-green-500/20 border-green-400/40" : "bg-brand-purple-950/60 border-brand-gold-400/40"}`}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {liveCount > 0 && <span className="absolute w-3 h-3 rounded-full bg-green-500 animate-ping" />}
                      <span className={`relative w-3 h-3 rounded-full block ${liveCount > 0 ? "bg-green-500" : "bg-brand-purple-300"}`} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest font-semibold text-brand-purple-200">Live Now</p>
                      <p className="font-black text-white text-xl">{liveCount}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-brand-gold-400/30">
                {[
                  { label: "Today", value: todayCount },
                  { label: "This Week", value: weekCount },
                  { label: "This Month", value: monthCount },
                  { label: "All Time", value: allVisits.length },
                ].map((stat) => (
                  <div key={stat.label} className="bg-brand-purple-950/60 rounded-2xl p-4 border border-brand-gold-400/40 text-center">
                    <p className="text-xs text-brand-purple-200 uppercase tracking-widest font-semibold mb-1">{stat.label}</p>
                    <p className="text-2xl font-heading font-black text-white">{stat.value.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SiteAnalyticsClient
            dailyData={dailyData}
            topPages={topPages}
            deviceCounts={deviceCounts}
            topCountries={topCountries}
            totalVisits={allVisits.length}
          />
        </div>
      </div>
    </div>
  );
}