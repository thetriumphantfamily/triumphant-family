// ───────────────────────────────────────────────────────────────
// TDA DASHBOARD CLIENT – Student portal overview
// Welcome header cloned from Church dashboard for mobile alignment
// ───────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getTitle(gender: string | null): string {
  if (gender === "male") return "Brother";
  if (gender === "female") return "Sister";
  return "Beloved";
}

export default function TDADashboardClient() {
  const [student, setStudent] = useState<Student | null>(null);
  const [stats, setStats] = useState<Stats>({
    materialsCount: 0, assignmentsCount: 0, submittedCount: 0,
    gradedCount: 0, attendedCount: 0, totalSessions: 0, attendancePercentage: 0,
  });
  const [latestAnnouncement, setLatestAnnouncement] = useState<Announcement | null>(null);
  const [scripture, setScripture] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    try {
      const session = localStorage.getItem("tda_student_session");
      if (!session) return;

      const sessionData = JSON.parse(session);
      const supabase = createClient();

      const { data: studentData } = await supabase
        .from("tda_students")
        .select("*")
        .eq("id", sessionData.id)
        .single();

      if (studentData) {
        setStudent(studentData);

        const [materialsRes, assignmentsRes, submissionsRes, sessionsRes, attendanceRes] =
          await Promise.all([
            supabase.from("tda_materials").select("id", { count: "exact", head: true }),
            supabase.from("tda_assignments").select("id", { count: "exact", head: true }),
            supabase.from("tda_submissions").select("id, status", { count: "exact" }).eq("student_id", studentData.id),
            supabase.from("tda_sessions").select("id", { count: "exact", head: true }),
            supabase.from("tda_attendance").select("id, status").eq("student_id", studentData.id),
          ]);

        const attendedCount = attendanceRes.data?.filter((a) => a.status === "present").length || 0;
        const totalSessions = sessionsRes.count || 0;
        const attendancePercentage = totalSessions > 0 ? Math.round((attendedCount / totalSessions) * 100) : 0;
        const gradedCount = submissionsRes.data?.filter((s) => s.status === "graded").length || 0;

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

      const { data: announcementData } = await supabase
        .from("tda_announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (announcementData) setLatestAnnouncement(announcementData);

      const { data: scriptureData } = await supabase
        .from("tda_settings")
        .select("setting_value")
        .eq("setting_key", "school_scripture")
        .single();

      if (scriptureData) setScripture(scriptureData.setting_value);

      setLoading(false);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen message="Loading your dashboard..." />;
  if (!student) return null;

  const greeting = getGreeting();
  const title = getTitle(student.gender);
  const firstName = student.full_name.split(" ")[0];

  return (
    <div className="space-y-4 pb-6">

      {/* ── Welcome Header (Church-style layout) ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">

          {/* Student Portal Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">
              Student Portal
            </span>
          </div>

          {/* Photo + Info side-by-side */}
          <div className="flex items-center gap-4 mb-4">
            {student.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={student.photo_url}
                alt={student.full_name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-brand-gold-400 shadow-gold flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 flex items-center justify-center text-brand-purple-900 font-black text-2xl border-2 border-brand-gold-400 flex-shrink-0">
                {firstName.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white/80 font-semibold text-base md:text-lg">{greeting},</p>
              <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {title} {firstName.toUpperCase()}!
              </h1>
              <p className="text-brand-purple-200 text-xs md:text-sm font-semibold mt-1">
                {student.student_id} • Level {student.level}
              </p>
            </div>
          </div>

          {/* School Level */}
          <div className="mt-4 pt-4 border-t border-brand-gold-400/30">
            <p className="text-brand-purple-300 text-[10px] uppercase tracking-widest font-black mb-1">
              Enrolled In
            </p>
            <p className="text-white font-bold text-sm md:text-base">
              {LEVEL_NAMES[student.level]}
            </p>
          </div>
        </div>
      </div>

      {/* ── Scripture of the Week ── */}
      {scripture && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center flex-shrink-0 text-xl">
              📖
            </div>
            <div>
              <p className="text-brand-purple-200 text-xs font-black uppercase tracking-widest mb-2">
                Scripture of the Week
              </p>
              <p className="text-white font-semibold text-sm leading-relaxed italic">
                {scripture}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link
          href="/bible-school/portal/materials"
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl active:scale-95 transition-all"
        >
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-3xl mb-2">📚</div>
          <p className="text-white font-black text-3xl mb-1">{stats.materialsCount}</p>
          <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Materials</p>
        </Link>

        <Link
          href="/bible-school/portal/assignments"
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl active:scale-95 transition-all"
        >
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-3xl mb-2">📝</div>
          <p className="text-white font-black text-3xl mb-1">
            {stats.submittedCount}/{stats.assignmentsCount}
          </p>
          <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Assignments</p>
        </Link>

        <Link
          href="/bible-school/portal/attendance"
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl active:scale-95 transition-all"
        >
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-3xl mb-2">✅</div>
          <p className="text-white font-black text-3xl mb-1">
            {stats.attendedCount}/{stats.totalSessions}
          </p>
          <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Attendance</p>
        </Link>

        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-3xl mb-2">📊</div>
          <p className="text-white font-black text-3xl mb-1">{stats.attendancePercentage}%</p>
          <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Attendance Rate</p>
        </div>
      </div>

      {/* ── Training Progress ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-base font-black text-white">
            🎯 Your Training Progress
          </h2>
          <span className="text-white font-black text-xl">
            {stats.attendancePercentage}%
          </span>
        </div>
        <div className="w-full h-3 bg-brand-purple-950/60 rounded-full overflow-hidden border border-brand-gold-400/20">
          <div
            className="h-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 rounded-full transition-all duration-500"
            style={{ width: `${stats.attendancePercentage}%` }}
          />
        </div>
        <p className="text-brand-purple-200 text-xs mt-2 font-semibold">
          Based on your session attendance. Keep attending to complete your training!
        </p>
      </div>

      {/* ── Quick Access ── */}
      <div>
        <h2 className="text-white font-heading font-bold text-base mb-3">
          ⚡ Quick Access
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { href: "/bible-school/portal/materials", icon: "📚", label: "Materials" },
            { href: "/bible-school/portal/assignments", icon: "📝", label: "Assignments" },
            { href: "/bible-school/portal/attendance", icon: "✅", label: "Attendance" },
            { href: "/bible-school/portal/announcements", icon: "📢", label: "News" },
            { href: "/bible-school/portal/chat", icon: "💬", label: "Discussion" },
            { href: "/bible-school/portal/id-card", icon: "🎴", label: "ID Card" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl active:scale-95 transition-all text-center"
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-white text-xs font-bold">{item.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Latest Announcement ── */}
      {latestAnnouncement && (
        <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
          latestAnnouncement.is_important ? "border-red-400/60" : "border-brand-gold-400/40"
        } p-5 shadow-xl`}>
          <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${
            latestAnnouncement.is_important
              ? "from-red-400 via-red-500 to-red-400"
              : "from-brand-gold-300 via-brand-gold-400 to-brand-gold-500"
          }`} />
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${
              latestAnnouncement.is_important ? "bg-red-500" : "bg-brand-purple-950/80 border border-brand-gold-400/40"
            }`}>
              📢
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="text-brand-purple-200 text-xs font-black uppercase tracking-widest">
                  Latest Announcement
                </p>
                {latestAnnouncement.is_important && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase">
                    Important
                  </span>
                )}
              </div>
              <h3 className="font-heading font-black text-white mb-2">
                {latestAnnouncement.title}
              </h3>
              <p className="text-white font-semibold text-sm leading-relaxed line-clamp-3">
                {latestAnnouncement.body}
              </p>
              <Link
                href="/bible-school/portal/announcements"
                className="text-brand-purple-200 text-sm font-bold hover:text-white transition-colors mt-2 inline-block"
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