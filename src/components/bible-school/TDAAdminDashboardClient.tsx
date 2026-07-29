// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN DASHBOARD CLIENT — Bible School admin overview
// Clean purple + gold theme — no blobs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Stats {
  totalStudents: number;
  approvedStudents: number;
  pendingStudents: number;
  rejectedStudents: number;
  totalCourses: number;
  totalMaterials: number;
  totalAssignments: number;
  totalSubmissions: number;
  gradedSubmissions: number;
  totalSessions: number;
  totalAnnouncements: number;
  graduatedStudents: number;
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

// Get time-based greeting
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

// Get today's date
function getTodayDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TDAAdminDashboardClient() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    approvedStudents: 0,
    pendingStudents: 0,
    rejectedStudents: 0,
    totalCourses: 0,
    totalMaterials: 0,
    totalAssignments: 0,
    totalSubmissions: 0,
    gradedSubmissions: 0,
    totalSessions: 0,
    totalAnnouncements: 0,
    graduatedStudents: 0,
    level100Count: 0,
    level200Count: 0,
    level300Count: 0,
    level400Count: 0,
  });
  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const supabase = createClient();

      const [
        studentsRes,
        approvedRes,
        pendingRes,
        rejectedRes,
        coursesRes,
        materialsRes,
        assignmentsRes,
        submissionsRes,
        gradedRes,
        sessionsRes,
        announcementsRes,
        graduatedRes,
        pendingListRes,
        level100Res,
        level200Res,
        level300Res,
        level400Res,
      ] = await Promise.all([
        supabase.from("tda_students").select("id", { count: "exact", head: true }),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("status", "rejected"),
        supabase.from("tda_courses").select("id", { count: "exact", head: true }),
        supabase.from("tda_materials").select("id", { count: "exact", head: true }),
        supabase.from("tda_assignments").select("id", { count: "exact", head: true }),
        supabase.from("tda_submissions").select("id", { count: "exact", head: true }),
        supabase.from("tda_submissions").select("id", { count: "exact", head: true }).eq("status", "graded"),
        supabase.from("tda_sessions").select("id", { count: "exact", head: true }),
        supabase.from("tda_announcements").select("id", { count: "exact", head: true }),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("graduation_status", "graduated"),
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
        rejectedStudents: rejectedRes.count || 0,
        totalCourses: coursesRes.count || 0,
        totalMaterials: materialsRes.count || 0,
        totalAssignments: assignmentsRes.count || 0,
        totalSubmissions: submissionsRes.count || 0,
        gradedSubmissions: gradedRes.count || 0,
        totalSessions: sessionsRes.count || 0,
        totalAnnouncements: announcementsRes.count || 0,
        graduatedStudents: graduatedRes.count || 0,
        level100Count: level100Res.count || 0,
        level200Count: level200Res.count || 0,
        level300Count: level300Res.count || 0,
        level400Count: level400Res.count || 0,
      });

      setPendingStudents(pendingListRes.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setLoading(false);
    }
  };

  const greeting = getGreeting();
  const todayDate = getTodayDate();

  const STAT_CARDS = [
    {
      name: "Total Students",
      value: stats.totalStudents,
      href: "/admin/bible-school/students",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      name: "Approved",
      value: stats.approvedStudents,
      href: "/admin/bible-school/students",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    },
    {
      name: "Pending Review",
      value: stats.pendingStudents,
      href: "/admin/bible-school/students",
      badge: stats.pendingStudents > 0,
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: "Materials",
      value: stats.totalMaterials,
      href: "/admin/bible-school/materials",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
    {
      name: "Assignments",
      value: stats.totalAssignments,
      href: "/admin/bible-school/assignments",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      ),
    },
    {
      name: "Sessions",
      value: stats.totalSessions,
      href: "/admin/bible-school/attendance",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-3 animate-pulse">
            <svg
              className="w-6 h-6 text-brand-purple-900 animate-spin"
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
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ━━━ HERO HEADER ━━━ */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 lg:p-10 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
                <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                <span className="text-brand-gold-300 font-semibold text-xs uppercase tracking-widest">
                  Bible School Command Center
                </span>
              </div>

              <p className="text-brand-gold-400 font-semibold text-lg mb-1">
                {greeting}, Prophet!
              </p>

              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                Triumphant{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
                  Disciples Academy
                </span>
              </h1>

              <p className="text-brand-purple-100 text-sm md:text-base mb-4">
                📅 {todayDate}
              </p>

              <p className="text-brand-purple-100 text-sm md:text-base max-w-2xl leading-relaxed">
                Manage students, materials, assignments, attendance, and more.
                Equipping believers for effective ministry.
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex-shrink-0">
              <svg
                className="w-12 h-12 text-brand-purple-900"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z" />
              </svg>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-brand-gold-400/30">
            <p className="text-brand-gold-400 italic text-sm md:text-base">
              &ldquo;Study to show thyself approved unto God, a workman that
              needeth not to be ashamed, rightly dividing the word of truth.&rdquo;
            </p>
            <p className="text-brand-purple-200 text-xs mt-1 font-semibold">
              — 2 Timothy 2:15
            </p>
          </div>
        </div>
      </div>

      {/* ━━━ PENDING APPROVALS ALERT ━━━ */}
      {stats.pendingStudents > 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-700 border-2 border-red-400/60 p-6 shadow-xl">
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0 animate-pulse">
              <svg
                className="w-7 h-7 text-brand-purple-900"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-bold text-white text-xl mb-2">
                🚨 New Student Registrations
              </h3>
              <p className="text-white/90 text-sm mb-3">
                {stats.pendingStudents} student(s) awaiting your approval
              </p>
              <Link
                href="/admin/bible-school/students"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-red-700 font-bold text-sm hover:bg-white/90 transition-colors"
              >
                Review Registrations
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ━━━ STATS SECTION HEADER ━━━ */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
            <svg
              className="w-5 h-5 text-brand-purple-900"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
          </div>
          <h2 className="font-heading font-bold text-brand-purple-900 text-xl">
            School Overview
          </h2>
        </div>
      </div>

      {/* ━━━ STATS GRID ━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {STAT_CARDS.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-brand-purple-900">
                  <span className="w-7 h-7">{card.icon}</span>
                </div>

                {card.badge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 shadow-lg animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span className="text-white text-xs font-bold">NEW</span>
                  </div>
                )}
              </div>

              <p className="text-brand-purple-200 text-sm uppercase tracking-widest font-semibold mb-2">
                {card.name}
              </p>

              <p className="text-5xl font-heading font-bold text-white mb-4">
                {card.value}
              </p>

              <div className="pt-4 border-t border-brand-gold-400/30 flex items-center gap-2 text-brand-gold-400 text-sm font-bold group-hover:gap-3 transition-all">
                <span>View Details</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ━━━ LEVEL DISTRIBUTION ━━━ */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
              <svg
                className="w-5 h-5 text-brand-purple-900"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-white text-xl">
              Students by Level
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { level: "100", count: stats.level100Count, name: "Christian Living" },
              { level: "200", count: stats.level200Count, name: "Nurturing" },
              { level: "300", count: stats.level300Count, name: "Administration" },
              { level: "400", count: stats.level400Count, name: "Leadership" },
            ].map((item) => (
              <div
                key={item.level}
                className="p-4 rounded-xl bg-brand-purple-950/60 border-2 border-brand-gold-400/30 text-center"
              >
                <p className="text-brand-gold-400 text-xs uppercase tracking-widest font-semibold mb-1">
                  Level {item.level}
                </p>
                <p className="text-4xl font-heading font-bold text-white mb-1">
                  {item.count}
                </p>
                <p className="text-brand-purple-200 text-xs">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ━━━ RECENT PENDING STUDENTS ━━━ */}
      {pendingStudents.length > 0 && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border-2 border-gray-100 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-brand-purple-900 text-xl">
              📥 Recent Registrations
            </h3>
            <Link
              href="/admin/bible-school/students"
              className="text-brand-gold-600 hover:text-brand-gold-700 text-sm font-bold"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {pendingStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-brand-gold-400 transition-colors"
              >
                {student.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={student.photo_url}
                    alt={student.full_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-brand-gold-400"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-bold">
                    {student.full_name.charAt(0)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-brand-purple-900 truncate">
                    {student.full_name}
                  </p>
                  <p className="text-gray-500 text-sm truncate">
                    {student.student_id} • Level {student.level} • {formatDate(student.created_at)}
                  </p>
                </div>

                <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-300">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ━━━ QUICK ACTIONS ━━━ */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
              <svg
                className="w-5 h-5 text-brand-purple-900"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-white text-xl">
              Quick Actions
            </h3>
          </div>

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
                className="p-4 rounded-xl bg-brand-purple-950/60 border-2 border-brand-gold-400/30 hover:border-brand-gold-400 text-center transition-all group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {action.emoji}
                </div>
                <p className="text-sm font-bold text-white">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}