// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN DASHBOARD CLIENT — Overview and stats
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Stats {
  totalMembers: number;
  approvedMembers: number;
  pendingMembers: number;
  totalVisitors: number;
  totalDonations: number;
  totalServices: number;
  totalDepartments: number;
  totalDevotionals: number;
  pendingQuestions: number;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getTodayDate(): string {
  return new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function ChurchAdminDashboardClient() {
  const [stats, setStats] = useState<Stats>({ totalMembers: 0, approvedMembers: 0, pendingMembers: 0, totalVisitors: 0, totalDonations: 0, totalServices: 0, totalDepartments: 0, totalDevotionals: 0, pendingQuestions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const supabase = createClient();
      const [members, approved, pending, visitors, donations, services, departments, devotionals, questions] = await Promise.all([
        supabase.from("tfam_members").select("id", { count: "exact", head: true }),
        supabase.from("tfam_members").select("id", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("tfam_members").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("tfam_visitors").select("id", { count: "exact", head: true }),
        supabase.from("tfam_donations").select("id", { count: "exact", head: true }),
        supabase.from("tfam_services").select("id", { count: "exact", head: true }),
        supabase.from("tfam_departments").select("id", { count: "exact", head: true }),
        supabase.from("tfam_devotionals").select("id", { count: "exact", head: true }),
        supabase.from("tfam_pastor_questions").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);

      setStats({
        totalMembers: members.count || 0,
        approvedMembers: approved.count || 0,
        pendingMembers: pending.count || 0,
        totalVisitors: visitors.count || 0,
        totalDonations: donations.count || 0,
        totalServices: services.count || 0,
        totalDepartments: departments.count || 0,
        totalDevotionals: devotionals.count || 0,
        pendingQuestions: questions.count || 0,
      });
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const STAT_CARDS = [
    { name: "Total Members", value: stats.totalMembers, href: "/admin/church/members", icon: "👥" },
    { name: "Approved", value: stats.approvedMembers, href: "/admin/church/members", icon: "✅" },
    { name: "Pending", value: stats.pendingMembers, href: "/admin/church/members", icon: "⏳", badge: stats.pendingMembers > 0 },
    { name: "Visitors", value: stats.totalVisitors, href: "/admin/church/visitors", icon: "🆕" },
    { name: "Donations", value: stats.totalDonations, href: "/admin/church/giving", icon: "💰" },
    { name: "Services", value: stats.totalServices, href: "/admin/church/attendance", icon: "⛪" },
  ];

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading dashboard...</p></div>;

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 lg:p-10 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-brand-gold-300 font-semibold text-xs uppercase tracking-widest">Church Management</span>
          </div>
          <p className="text-brand-gold-400 font-semibold text-lg mb-1">{getGreeting()}, Prophet!</p>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            Church{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Command Center
            </span>
          </h1>
          <p className="text-brand-purple-100 text-sm md:text-base mb-4">📅 {getTodayDate()}</p>
          <p className="text-brand-purple-100 text-sm max-w-2xl">
            Manage members, track attendance, record giving, post devotionals, and care for your flock.
          </p>
          <div className="mt-6 pt-6 border-t border-brand-gold-400/30">
            <p className="text-brand-gold-400 italic text-sm">&ldquo;Feed my sheep.&rdquo;</p>
            <p className="text-brand-purple-200 text-xs mt-1 font-semibold">— John 21:17</p>
          </div>
        </div>
      </div>

      {/* Pending Alert */}
      {stats.pendingMembers > 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-700 border-2 border-red-400/60 p-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0 animate-pulse text-2xl">🚨</div>
            <div className="flex-1">
              <h3 className="font-heading font-bold text-white text-xl mb-2">New Member Registrations</h3>
              <p className="text-white/90 text-sm mb-3">{stats.pendingMembers} member(s) awaiting approval</p>
              <Link href="/admin/church/members" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-red-700 font-bold text-sm hover:bg-white/90 transition-colors">
                Review Now →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-lg">📊</div>
          <h2 className="font-heading font-bold text-brand-purple-900 text-xl">Church Overview</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STAT_CARDS.map((card) => (
            <Link key={card.name} href={card.href}
              className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-2xl">{card.icon}</div>
                  {card.badge && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 shadow-lg animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span className="text-white text-xs font-bold">NEW</span>
                    </div>
                  )}
                </div>
                <p className="text-brand-purple-200 text-sm uppercase tracking-widest font-semibold mb-2">{card.name}</p>
                <p className="text-5xl font-heading font-bold text-white mb-4">{card.value}</p>
                <div className="pt-4 border-t border-brand-gold-400/30 flex items-center gap-2 text-brand-gold-400 text-sm font-bold group-hover:gap-3 transition-all">
                  <span>View Details</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-lg">⚡</div>
            <h3 className="font-heading font-bold text-white text-xl">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: "/admin/church/members", icon: "👥", label: "Members" },
              { href: "/admin/church/giving", icon: "💰", label: "Record Giving" },
              { href: "/admin/church/devotionals", icon: "📖", label: "Post Devotional" },
              { href: "/admin/church/attendance", icon: "✅", label: "Mark Attendance" },
            ].map((action) => (
              <Link key={action.href} href={action.href}
                className="p-4 rounded-xl bg-brand-purple-950/60 border-2 border-brand-gold-400/30 hover:border-brand-gold-400 text-center transition-all group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</div>
                <p className="text-sm font-bold text-white">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}