// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ATTENDANCE CLIENT – Student attendance viewer
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

interface Session {
  id: string;
  title: string;
  description: string | null;
  session_date: string;
  session_time: string | null;
  location: string | null;
  level: string | null;
}

interface AttendanceRecord {
  id: string;
  session_id: string;
  status: string;
  marked_at: string;
}

interface SessionWithAttendance extends Session {
  attendance?: AttendanceRecord;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function isUpcoming(sessionDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sessionDay = new Date(sessionDate);
  sessionDay.setHours(0, 0, 0, 0);
  return sessionDay >= today;
}

function getStatusBadge(session: SessionWithAttendance): {
  label: string;
  className: string;
} {
  if (isUpcoming(session.session_date)) {
    return { label: "📅 Upcoming", className: "bg-blue-500/20 text-blue-300 border-blue-400/40" };
  }
  if (session.attendance?.status === "present") {
    return { label: "✅ Present", className: "bg-green-500/20 text-green-300 border-green-400/40" };
  }
  return { label: "❌ Absent", className: "bg-red-500/20 text-red-300 border-red-400/40" };
}

export default function TDAAttendanceClient() {
  const [sessions, setSessions] = useState<SessionWithAttendance[]>([]);
  const [studentLevel, setStudentLevel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "present" | "absent" | "upcoming">("all");

  useEffect(() => { loadAttendance(); }, []);

  const loadAttendance = async () => {
    try {
      const session = localStorage.getItem("tda_student_session");
      if (!session) return;
      const sessionData = JSON.parse(session);
      setStudentLevel(sessionData.level);
      const supabase = createClient();
      const { data: sessionsData } = await supabase
        .from("tda_sessions").select("*")
        .or(`level.eq.${sessionData.level},level.is.null`)
        .order("session_date", { ascending: false });
      const { data: attendanceData } = await supabase
        .from("tda_attendance").select("*").eq("student_id", sessionData.id);
      const combined: SessionWithAttendance[] = (sessionsData || []).map((s) => ({
        ...s,
        attendance: attendanceData?.find((a) => a.session_id === s.id),
      }));
      setSessions(combined);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const pastSessions = sessions.filter((s) => !isUpcoming(s.session_date));
  const attendedCount = pastSessions.filter((s) => s.attendance?.status === "present").length;
  const absentCount = pastSessions.filter((s) => !s.attendance || s.attendance.status !== "present").length;
  const upcomingCount = sessions.filter((s) => isUpcoming(s.session_date)).length;
  const attendancePercentage = pastSessions.length > 0
    ? Math.round((attendedCount / pastSessions.length) * 100) : 0;

  const filteredSessions = sessions.filter((s) => {
    if (filter === "all") return true;
    if (filter === "present") return s.attendance?.status === "present";
    if (filter === "absent") return !isUpcoming(s.session_date) && (!s.attendance || s.attendance.status !== "present");
    if (filter === "upcoming") return isUpcoming(s.session_date);
    return true;
  });

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading attendance..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header + Attendance Bar ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Attendance</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
            ✅ Attendance Record
          </h1>
          <p className="text-brand-purple-200 text-sm mb-4">
            Track your class attendance for Level {studentLevel}.
          </p>

          {/* Attendance Rate */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-black text-sm">🎯 Attendance Rate</p>
            <span className="text-white font-black text-2xl">{attendancePercentage}%</span>
          </div>
          <div className="w-full h-3 bg-brand-purple-950/60 rounded-full overflow-hidden border border-brand-gold-400/20 mb-2">
            <div
              className="h-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 rounded-full transition-all duration-500"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
          <p className="text-brand-purple-200 text-xs font-semibold">
            {attendedCount} of {pastSessions.length} sessions attended
          </p>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Sessions", value: sessions.length, border: "border-brand-gold-400/40" },
          { label: "Present", value: attendedCount, border: "border-green-400/40" },
          { label: "Absent", value: absentCount, border: "border-red-400/40" },
          { label: "Upcoming", value: upcomingCount, border: "border-blue-400/40" },
        ].map((s) => (
          <div key={s.label} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${s.border} p-4 shadow-xl`}>
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">{s.label}</p>
            <p className="text-white font-black text-2xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex flex-wrap gap-2">
        {(["all", "present", "absent", "upcoming"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-black transition-all capitalize ${
              filter === f
                ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                : "bg-white text-brand-purple-900"
            }`}
          >
            {f === "all" ? "All Sessions" : f}
          </button>
        ))}
      </div>

      {/* ── Sessions List ── */}
      {filteredSessions.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">✅</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">
            {filter === "all" ? "No sessions yet" : `No ${filter} sessions`}
          </h3>
          <p className="text-brand-purple-200 text-sm">
            {filter === "all"
              ? "Sessions will appear here once created by your instructor"
              : `You have no ${filter} sessions`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session) => {
            const status = getStatusBadge(session);
            return (
              <div
                key={session.id}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl"
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-white text-base truncate">{session.title}</p>
                    {session.description && (
                      <p className="text-brand-purple-200 text-xs mt-0.5 line-clamp-1">{session.description}</p>
                    )}
                    <p className="text-brand-purple-200 text-xs mt-1">
                      📅 {formatDate(session.session_date)}
                      {session.session_time && ` • 🕐 ${session.session_time}`}
                    </p>
                    {session.location && (
                      <p className="text-brand-purple-200 text-xs">📍 {session.location}</p>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border flex-shrink-0 ${status.className}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Info Note ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center flex-shrink-0 text-xl">
            💡
          </div>
          <div>
            <p className="font-black text-white mb-2">About Attendance</p>
            <ul className="text-brand-purple-200 text-sm space-y-1 list-disc pl-4">
              <li>Attendance is marked by your instructor after each session</li>
              <li>Aim for at least 75% attendance to graduate</li>
              <li>Contact your instructor if you notice any errors</li>
              <li>Upcoming sessions are shown so you can plan ahead</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}