// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN DASHBOARD CLIENT – Bible School admin overview
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

interface Stats {
  totalStudents: number;
  approvedStudents: number;
  pendingStudents: number;
  totalMaterials: number;
  totalAssignments: number;
  totalSessions: number;
  level100Count: number;
  level200Count: number;
  level300Count: number;
  level400Count: number;
}

interface PendingStudent {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  level: string;
  photo_url: string | null;
  created_at: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getTodayDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function TDAAdminDashboardClient() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0, approvedStudents: 0, pendingStudents: 0,
    totalMaterials: 0, totalAssignments: 0, totalSessions: 0,
    level100Count: 0, level200Count: 0, level300Count: 0, level400Count: 0,
  });
  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    try {
      const supabase = createClient();
      const [
        studentsRes, approvedRes, pendingRes,
        materialsRes, assignmentsRes, sessionsRes,
        pendingListRes, level100Res, level200Res, level300Res, level400Res,
      ] = await Promise.all([
        supabase.from("tda_students").select("id", { count: "exact", head: true }),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("tda_materials").select("id", { count: "exact", head: true }),
        supabase.from("tda_assignments").select("id", { count: "exact", head: true }),
        supabase.from("tda_sessions").select("id", { count: "exact", head: true }),
        supabase.from("tda_students").select("*").eq("status", "pending").order("created_at", { ascending: false }).limit(5),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("level", "100"),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("level", "200"),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("level", "300"),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("level", "400"),
      ]);

      setStats({
        totalStudents: studentsRes.count || 0,
        approvedStudents: approvedRes.count || 0,
        pendingStudents: pendingRes.count || 0,
        totalMaterials: materialsRes.count || 0,
        totalAssignments: assignmentsRes.count || 0,
        totalSessions: sessionsRes.count || 0,
        level100Count: level100Res.count || 0,
        level200Count: level200Res.count || 0,
        level300Count: level300Res.count || 0,
        level400Count: level400Res.count || 0,
      });

      setPendingStudents(pendingListRes.data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading dashboard..." />;

  const STAT_CARDS = [
    { name: "Total Students", value: stats.totalStudents, href: "/admin/bible-school/students", icon: "👥" },
    { name: "Approved", value: stats.approvedStudents, href: "/admin/bible-school/students", icon: "✅" },
    { name: "Pending Review", value: stats.pendingStudents, href: "/admin/bible-school/students", badge: stats.pendingStudents > 0, icon: "⏳" },
    { name: "Materials", value: stats.totalMaterials, href: "/admin/bible-school/materials", icon: "📚" },
    { name: "Assignments", value: stats.totalAssignments, href: "/admin/bible-school/assignments", icon: "📝" },
    { name: "Sessions", value: stats.totalSessions, href: "/admin/bible-school/attendance", icon: "📅" },
  ];

  return (
    <div className="space-y-4 pb-6">

      {/* ── Hero Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 lg:p-10 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">
              Bible School Command Center
            </span>
          </div>
          <p className="text-white/80 font-semibold text-base mb-1">
            {getGreeting()}, Prophet!
          </p>
          <h1 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            Triumphant Disciples Academy
          </h1>
          <p className="text-brand-purple-100 text-sm md:text-base mb-4">
            📅 {getTodayDate()}
          </p>
          <p className="text-brand-purple-100 text-sm max-w-2xl leading-relaxed">
            Manage students, materials, assignments, attendance, and more. Equipping believers for effective ministry.
          </p>
          <div className="mt-4 pt-4 border-t border-brand-gold-400/30">
            <p className="text-white/70 italic text-sm">
              &ldquo;Study to show thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth.&rdquo;
            </p>
            <p className="text-brand-purple-200 text-xs mt-1 font-semibold">— 2 Timothy 2:15</p>
          </div>
        </div>
      </div>

      {/* ── Pending Alert ── */}
      {stats.pendingStudents > 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-red-400/60 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-400 via-red-500 to-red-400" />
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple-950/80 border border-red-400/40 flex items-center justify-center flex-shrink-0 text-2xl animate-pulse">
              🚨
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-bold text-white text-base mb-1">
                New Student Registrations
              </h3>
              <p className="text-white/80 text-sm mb-3">
                {stats.pendingStudents} student(s) awaiting your approval.
              </p>
              <Link
                href="/admin/bible-school/students"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-sm shadow-gold active:scale-95 transition-all"
              >
                Review Registrations →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Stats Grid ── */}
      <h2 className="text-white font-heading font-bold text-base">📊 School Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {STAT_CARDS.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 p-4 md:p-6 shadow-xl transition-all active:scale-95"
          >
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center text-xl md:text-2xl">
                  {card.icon}
                </div>
                {card.badge && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span className="text-white text-xs font-bold">NEW</span>
                  </div>
                )}
              </div>
              <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">{card.name}</p>
              <p className="text-white font-black text-3xl md:text-4xl mb-3">{card.value}</p>
              <div className="pt-3 border-t border-brand-gold-400/30 flex items-center gap-2 text-white/60 text-xs font-bold">
                <span>View Details</span>
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Level Distribution ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <h3 className="font-heading font-bold text-white text-base mb-4">
            📚 Students by Level
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { level: "100", count: stats.level100Count, name: "Christian Living" },
              { level: "200", count: stats.level200Count, name: "Nurturing" },
              { level: "300", count: stats.level300Count, name: "Administration" },
              { level: "400", count: stats.level400Count, name: "Leadership" },
            ].map((item) => (
              <div key={item.level} className="p-4 rounded-xl bg-brand-purple-950/60 border border-brand-gold-400/30 text-center">
                <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">Level {item.level}</p>
                <p className="text-white font-black text-3xl mb-1">{item.count}</p>
                <p className="text-brand-purple-200 text-xs">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Pending Students ── */}
      {pendingStudents.length > 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-white text-base">
              📥 Recent Registrations
            </h3>
            <Link href="/admin/bible-school/students" className="text-white/80 text-sm font-bold hover:text-white">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {pendingStudents.map((student) => (
              <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl bg-brand-purple-950/60 border border-brand-gold-400/30">
                {student.photo_url ? (
                  <img src={student.photo_url} alt={student.full_name} className="w-10 h-10 rounded-full object-cover border-2 border-brand-gold-400/40 flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-purple-950/80 border-2 border-brand-gold-400/40 flex items-center justify-center text-white font-black flex-shrink-0">
                    {student.full_name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-white truncate text-sm">{student.full_name}</p>
                  <p className="text-brand-purple-200 text-xs truncate">
                    {student.student_id} • Level {student.level} • {formatDate(student.created_at)}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-brand-purple-950/60 text-white border border-brand-gold-400/40 flex-shrink-0">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <h3 className="font-heading font-bold text-white text-base mb-4">⚡ Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: "/admin/bible-school/students", emoji: "👥", label: "Students" },
              { href: "/admin/bible-school/materials", emoji: "📚", label: "Materials" },
              { href: "/admin/bible-school/assignments", emoji: "📝", label: "Assignments" },
              { href: "/admin/bible-school/announcements", emoji: "📢", label: "Post News" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="p-4 rounded-xl bg-brand-purple-950/60 border border-brand-gold-400/30 hover:border-brand-gold-400 text-center transition-all active:scale-95"
              >
                <div className="text-2xl md:text-3xl mb-2">{action.emoji}</div>
                <p className="text-xs md:text-sm font-bold text-white">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}