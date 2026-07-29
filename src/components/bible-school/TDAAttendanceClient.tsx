// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ATTENDANCE CLIENT — Student attendance viewer
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format short date
function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Check if session is upcoming
function isUpcoming(sessionDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sessionDay = new Date(sessionDate);
  sessionDay.setHours(0, 0, 0, 0);
  return sessionDay >= today;
}

// Get status display
function getStatusDisplay(session: SessionWithAttendance): {
  label: string;
  color: string;
  icon: string;
} {
  if (isUpcoming(session.session_date)) {
    return {
      label: "Upcoming",
      color: "bg-blue-100 text-blue-700 border-blue-300",
      icon: "📅",
    };
  }
  if (session.attendance?.status === "present") {
    return {
      label: "Present",
      color: "bg-green-100 text-green-700 border-green-300",
      icon: "✅",
    };
  }
  return {
    label: "Absent",
    color: "bg-red-100 text-red-700 border-red-300",
    icon: "❌",
  };
}

export default function TDAAttendanceClient() {
  const [sessions, setSessions] = useState<SessionWithAttendance[]>([]);
  const [studentLevel, setStudentLevel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "present" | "absent" | "upcoming"
  >("all");

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const session = localStorage.getItem("tda_student_session");
      if (!session) return;

      const sessionData = JSON.parse(session);
      setStudentLevel(sessionData.level);

      const supabase = createClient();

      // Fetch all sessions for student's level
      const { data: sessionsData } = await supabase
        .from("tda_sessions")
        .select("*")
        .or(`level.eq.${sessionData.level},level.is.null`)
        .order("session_date", { ascending: false });

      // Fetch student's attendance
      const { data: attendanceData } = await supabase
        .from("tda_attendance")
        .select("*")
        .eq("student_id", sessionData.id);

      // Combine
      const combined: SessionWithAttendance[] = (sessionsData || []).map(
        (s) => ({
          ...s,
          attendance: attendanceData?.find((a) => a.session_id === s.id),
        })
      );

      setSessions(combined);
      setLoading(false);
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  // Calculate stats
  const pastSessions = sessions.filter((s) => !isUpcoming(s.session_date));
  const attendedCount = pastSessions.filter(
    (s) => s.attendance?.status === "present"
  ).length;
  const absentCount = pastSessions.filter(
    (s) => !s.attendance || s.attendance.status !== "present"
  ).length;
  const upcomingCount = sessions.filter((s) =>
    isUpcoming(s.session_date)
  ).length;

  const attendancePercentage =
    pastSessions.length > 0
      ? Math.round((attendedCount / pastSessions.length) * 100)
      : 0;

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    if (filter === "all") return true;
    if (filter === "present") return s.attendance?.status === "present";
    if (filter === "absent")
      return !isUpcoming(s.session_date) && (!s.attendance || s.attendance.status !== "present");
    if (filter === "upcoming") return isUpcoming(s.session_date);
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading attendance...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
          ✅ Attendance Record
        </h1>
        <p className="text-gray-600 text-sm">
          Track your class attendance for Level {studentLevel}
        </p>
      </div>

      {/* Overall Attendance Bar */}
      <div className="bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-lg font-bold text-white">
              🎯 Your Attendance Rate
            </h2>
            <span className="text-3xl font-bold text-brand-gold-400">
              {attendancePercentage}%
            </span>
          </div>

          <div className="w-full h-4 bg-brand-purple-950 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 rounded-full transition-all duration-500"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>

          <p className="text-brand-purple-100 text-sm">
            {attendedCount} of {pastSessions.length} sessions attended
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
            Total Sessions
          </p>
          <p className="text-2xl font-bold text-brand-purple-900">
            {sessions.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-green-200 shadow-md">
          <p className="text-xs text-green-600 uppercase font-semibold mb-1">
            Present
          </p>
          <p className="text-2xl font-bold text-green-600">
            {attendedCount}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-red-200 shadow-md">
          <p className="text-xs text-red-600 uppercase font-semibold mb-1">
            Absent
          </p>
          <p className="text-2xl font-bold text-red-600">{absentCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-blue-200 shadow-md">
          <p className="text-xs text-blue-600 uppercase font-semibold mb-1">
            Upcoming
          </p>
          <p className="text-2xl font-bold text-blue-600">{upcomingCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "present", "absent", "upcoming"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all capitalize ${
              filter === f
                ? "bg-brand-purple-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
            }`}
          >
            {f === "all" ? "All Sessions" : f}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-purple-100 mb-4">
            <svg
              className="w-10 h-10 text-brand-purple-600"
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
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            {filter === "all" ? "No sessions yet" : `No ${filter} sessions`}
          </h3>
          <p className="text-gray-500">
            {filter === "all"
              ? "Sessions will appear here once created by your instructor"
              : `You have no ${filter} sessions`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-purple-50 border-b-2 border-brand-purple-100">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-brand-purple-900 text-sm">
                    Session
                  </th>
                  <th className="text-left px-4 py-3 font-bold text-brand-purple-900 text-sm hidden md:table-cell">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 font-bold text-brand-purple-900 text-sm hidden lg:table-cell">
                    Location
                  </th>
                  <th className="text-center px-4 py-3 font-bold text-brand-purple-900 text-sm">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => {
                  const status = getStatusDisplay(session);

                  return (
                    <tr
                      key={session.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <p className="font-bold text-brand-purple-900 text-sm">
                          {session.title}
                        </p>
                        {session.description && (
                          <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                            {session.description}
                          </p>
                        )}
                        <p className="text-gray-400 text-xs mt-1 md:hidden">
                          {formatShortDate(session.session_date)}
                        </p>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="text-gray-700 text-sm">
                          {formatDate(session.session_date)}
                        </p>
                        {session.session_time && (
                          <p className="text-gray-500 text-xs">
                            🕐 {session.session_time}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <p className="text-gray-700 text-sm">
                          {session.location || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${status.color}`}
                        >
                          {status.icon} {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="bg-brand-gold-50 border-2 border-brand-gold-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0 text-brand-purple-900">
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
                d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
          </div>
          <div>
            <p className="font-bold text-brand-purple-900 mb-1">
              💡 About Attendance
            </p>
            <ul className="text-brand-purple-700 text-sm space-y-1 list-disc pl-4">
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