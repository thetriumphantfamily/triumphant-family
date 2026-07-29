// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA DASHBOARD CLIENT — Student portal overview
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Student {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  photo_url: string | null;
  level: string;
  department: string | null;
  batch: string;
  graduation_status: string;
  gender: string | null;
}

interface Stats {
  materialsCount: number;
  assignmentsCount: number;
  submittedCount: number;
  gradedCount: number;
  attendedCount: number;
  totalSessions: number;
  attendancePercentage: number;
}

interface Announcement {
  id: string;
  title: string;
  body: string;
  is_important: boolean;
  created_at: string;
}

const LEVEL_NAMES: Record<string, string> = {
  "100": "School of Triumphant Christian Living",
  "200": "School of Nurturing",
  "300": "School of Church Administration",
  "400": "School of Spiritual Leadership & Ministry",
};

// Get time-based greeting
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

// Get title based on gender
function getTitle(gender: string | null): string {
  if (gender === "male") return "Brother";
  if (gender === "female") return "Sister";
  return "Beloved";
}

export default function TDADashboardClient() {
  const [student, setStudent] = useState<Student | null>(null);
  const [stats, setStats] = useState<Stats>({
    materialsCount: 0,
    assignmentsCount: 0,
    submittedCount: 0,
    gradedCount: 0,
    attendedCount: 0,
    totalSessions: 0,
    attendancePercentage: 0,
  });
  const [latestAnnouncement, setLatestAnnouncement] =
    useState<Announcement | null>(null);
  const [scripture, setScripture] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const session = localStorage.getItem("tda_student_session");
      if (!session) return;

      const sessionData = JSON.parse(session);
      const supabase = createClient();

      // Fetch full student data
      const { data: studentData } = await supabase
        .from("tda_students")
        .select("*")
        .eq("id", sessionData.id)
        .single();

      if (studentData) {
        setStudent(studentData);

        // Fetch stats
        const [
          materialsRes,
          assignmentsRes,
          submissionsRes,
          sessionsRes,
          attendanceRes,
        ] = await Promise.all([
          supabase
            .from("tda_materials")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("tda_assignments")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("tda_submissions")
            .select("id, status", { count: "exact" })
            .eq("student_id", studentData.id),
          supabase
            .from("tda_sessions")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("tda_attendance")
            .select("id, status")
            .eq("student_id", studentData.id),
        ]);

        const attendedCount =
          attendanceRes.data?.filter((a) => a.status === "present").length ||
          0;
        const totalSessions = sessionsRes.count || 0;
        const attendancePercentage =
          totalSessions > 0
            ? Math.round((attendedCount / totalSessions) * 100)
            : 0;

        const gradedCount =
          submissionsRes.data?.filter((s) => s.status === "graded").length ||
          0;

        setStats({
          materialsCount: materialsRes.count || 0,
          assignmentsCount: assignmentsRes.count || 0,
          submittedCount: submissionsRes.count || 0,
          gradedCount,
          attendedCount,
          totalSessions,
          attendancePercentage,
        });
      }

      // Fetch latest announcement
      const { data: announcementData } = await supabase
        .from("tda_announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (announcementData) {
        setLatestAnnouncement(announcementData);
      }

      // Fetch scripture of the week
      const { data: scriptureData } = await supabase
        .from("tda_settings")
        .select("setting_value")
        .eq("setting_key", "school_scripture")
        .single();

      if (scriptureData) {
        setScripture(scriptureData.setting_value);
      }

      setLoading(false);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setLoading(false);
    }
  };

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

  if (!student) return null;

  const greeting = getGreeting();
  const title = getTitle(student.gender);

  return (
    <div className="space-y-6">
      {/* ━━━ WELCOME HEADER ━━━ */}
      <div className="relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-6 lg:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          {/* Photo */}
          {student.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={student.photo_url}
              alt={student.full_name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-brand-gold-400 shadow-gold flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-bold text-3xl flex-shrink-0">
              {student.full_name.charAt(0)}
            </div>
          )}

          {/* Welcome text */}
          <div className="flex-1">
            <p className="text-brand-gold-400 font-semibold text-sm mb-1">
              {greeting}, {title}!
            </p>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
              {student.full_name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-gold-400/20 border border-brand-gold-400/40 text-brand-gold-300 font-semibold text-xs">
                {student.student_id}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-purple-950/60 border border-brand-purple-500/40 text-brand-purple-100 font-semibold text-xs">
                Level {student.level} — {LEVEL_NAMES[student.level]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ SCRIPTURE OF THE WEEK ━━━ */}
      {scripture && (
        <div className="bg-brand-gold-50 border-2 border-brand-gold-200 rounded-2xl p-5 lg:p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-brand-purple-900"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-brand-purple-900 uppercase tracking-widest mb-2">
                📖 Scripture of the Week
              </p>
              <p className="text-brand-purple-800 text-sm md:text-base italic leading-relaxed">
                {scripture}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ━━━ STATS CARDS ━━━ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/bible-school/portal/materials"
          className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md hover:shadow-lg hover:border-brand-purple-300 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-brand-purple-100 flex items-center justify-center text-brand-purple-600 mb-3 group-hover:bg-brand-purple-600 group-hover:text-white transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold font-heading text-brand-purple-900 mb-1">
            {stats.materialsCount}
          </p>
          <p className="text-sm text-gray-600 font-semibold">Materials</p>
        </Link>

        <Link
          href="/bible-school/portal/assignments"
          className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md hover:shadow-lg hover:border-brand-gold-400 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-brand-gold-100 flex items-center justify-center text-brand-gold-600 mb-3 group-hover:bg-brand-gold-500 group-hover:text-white transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold font-heading text-brand-purple-900 mb-1">
            {stats.submittedCount}/{stats.assignmentsCount}
          </p>
          <p className="text-sm text-gray-600 font-semibold">Assignments</p>
        </Link>

        <Link
          href="/bible-school/portal/attendance"
          className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md hover:shadow-lg hover:border-green-400 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold font-heading text-brand-purple-900 mb-1">
            {stats.attendedCount}/{stats.totalSessions}
          </p>
          <p className="text-sm text-gray-600 font-semibold">Attendance</p>
        </Link>

        <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold font-heading text-brand-purple-900 mb-1">
            {stats.attendancePercentage}%
          </p>
          <p className="text-sm text-gray-600 font-semibold">Attendance Rate</p>
        </div>
      </div>

      {/* ━━━ TRAINING PROGRESS ━━━ */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border-2 border-gray-100 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-bold text-brand-purple-900">
            🎯 Your Training Progress
          </h2>
          <span className="text-2xl font-bold text-brand-gold-500">
            {stats.attendancePercentage}%
          </span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 rounded-full transition-all duration-500"
            style={{ width: `${stats.attendancePercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Based on your session attendance record. Keep attending to complete
          your training successfully!
        </p>
      </div>

      {/* ━━━ QUICK ACCESS ━━━ */}
      <div>
        <h2 className="font-heading text-xl font-bold text-brand-purple-900 mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              href: "/bible-school/portal/materials",
              icon: "📚",
              label: "Materials",
            },
            {
              href: "/bible-school/portal/assignments",
              icon: "📝",
              label: "Assignments",
            },
            {
              href: "/bible-school/portal/attendance",
              icon: "✅",
              label: "Attendance",
            },
            {
              href: "/bible-school/portal/announcements",
              icon: "📢",
              label: "News",
            },
            {
              href: "/bible-school/portal/chat",
              icon: "💬",
              label: "Discussion",
            },
            {
              href: "/bible-school/portal/id-card",
              icon: "🎴",
              label: "ID Card",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md hover:shadow-lg hover:border-brand-gold-400 hover:-translate-y-0.5 transition-all text-center group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <p className="text-xs font-bold text-brand-purple-900">
                {item.label}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* ━━━ LATEST ANNOUNCEMENT ━━━ */}
      {latestAnnouncement && (
        <div
          className={`rounded-2xl p-5 lg:p-6 border-2 ${
            latestAnnouncement.is_important
              ? "bg-red-50 border-red-200"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                latestAnnouncement.is_important
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.34 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                  Latest Announcement
                </p>
                {latestAnnouncement.is_important && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase">
                    Important
                  </span>
                )}
              </div>
              <h3 className="font-heading font-bold text-brand-purple-900 mb-2">
                {latestAnnouncement.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {latestAnnouncement.body}
              </p>
              <Link
                href="/bible-school/portal/announcements"
                className="text-brand-purple-600 text-sm font-bold hover:underline mt-2 inline-block"
              >
                View all announcements →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}