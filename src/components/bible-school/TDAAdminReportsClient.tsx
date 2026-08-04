// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN REPORTS CLIENT – School analytics and statistics
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

interface ReportData {
  students: {
    total: number; approved: number; pending: number;
    rejected: number; graduated: number; male: number; female: number;
    level100: number; level200: number; level300: number; level400: number;
  };
  attendance: {
    totalSessions: number; totalRecords: number;
    presentCount: number; averageRate: number;
  };
  assignments: {
    totalAssignments: number; totalSubmissions: number;
    gradedSubmissions: number; gradingRate: number;
  };
  content: {
    materials: number; announcements: number; chatMessages: number;
  };
}

export default function TDAAdminReportsClient() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    try {
      const supabase = createClient();
      const [
        totalStudents, approvedStudents, pendingStudents, rejectedStudents,
        graduatedStudents, maleStudents, femaleStudents,
        level100, level200, level300, level400,
        totalSessions, totalAttendance, presentAttendance,
        totalAssignments, totalSubmissions, gradedSubmissions,
        totalMaterials, totalAnnouncements, totalChat,
      ] = await Promise.all([
        supabase.from("tda_students").select("id", { count: "exact", head: true }),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("status", "rejected"),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("graduation_status", "graduated"),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("gender", "male"),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("gender", "female"),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("level", "100"),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("level", "200"),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("level", "300"),
        supabase.from("tda_students").select("id", { count: "exact", head: true }).eq("level", "400"),
        supabase.from("tda_sessions").select("id", { count: "exact", head: true }),
        supabase.from("tda_attendance").select("id", { count: "exact", head: true }),
        supabase.from("tda_attendance").select("id", { count: "exact", head: true }).eq("status", "present"),
        supabase.from("tda_assignments").select("id", { count: "exact", head: true }),
        supabase.from("tda_submissions").select("id", { count: "exact", head: true }),
        supabase.from("tda_submissions").select("id", { count: "exact", head: true }).eq("status", "graded"),
        supabase.from("tda_materials").select("id", { count: "exact", head: true }),
        supabase.from("tda_announcements").select("id", { count: "exact", head: true }),
        supabase.from("tda_chat_messages").select("id", { count: "exact", head: true }).eq("is_deleted", false),
      ]);

      const totalAttendanceCount = totalAttendance.count || 0;
      const presentCount = presentAttendance.count || 0;
      const totalSubmissionsCount = totalSubmissions.count || 0;
      const gradedCount = gradedSubmissions.count || 0;

      setData({
        students: {
          total: totalStudents.count || 0,
          approved: approvedStudents.count || 0,
          pending: pendingStudents.count || 0,
          rejected: rejectedStudents.count || 0,
          graduated: graduatedStudents.count || 0,
          male: maleStudents.count || 0,
          female: femaleStudents.count || 0,
          level100: level100.count || 0, level200: level200.count || 0,
          level300: level300.count || 0, level400: level400.count || 0,
        },
        attendance: {
          totalSessions: totalSessions.count || 0,
          totalRecords: totalAttendanceCount, presentCount,
          averageRate: totalAttendanceCount > 0 ? Math.round((presentCount / totalAttendanceCount) * 100) : 0,
        },
        assignments: {
          totalAssignments: totalAssignments.count || 0,
          totalSubmissions: totalSubmissionsCount, gradedSubmissions: gradedCount,
          gradingRate: totalSubmissionsCount > 0 ? Math.round((gradedCount / totalSubmissionsCount) * 100) : 0,
        },
        content: {
          materials: totalMaterials.count || 0,
          announcements: totalAnnouncements.count || 0,
          chatMessages: totalChat.count || 0,
        },
      });
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading reports..." />;
  if (!data) return null;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Page Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Reports</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
            📊 Reports & Analytics
          </h1>
          <p className="text-brand-purple-200 text-sm">
            Comprehensive overview of your Bible School data.
          </p>
        </div>
      </div>

      {/* ── SECTION 1: STUDENT STATISTICS ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <h2 className="font-heading text-base font-black text-white mb-4 flex items-center gap-2">
          👥 Student Statistics
        </h2>

        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {[
            { label: "Total", value: data.students.total, border: "border-brand-gold-400/40" },
            { label: "Approved", value: data.students.approved, border: "border-green-400/40" },
            { label: "Pending", value: data.students.pending, border: "border-brand-gold-400/40" },
            { label: "Rejected", value: data.students.rejected, border: "border-red-400/40" },
            { label: "Graduated", value: data.students.graduated, border: "border-green-400/40" },
          ].map((s) => (
            <div key={s.label} className={`bg-brand-purple-950/60 rounded-xl p-4 text-center border ${s.border}`}>
              <p className="text-white font-black text-3xl">{s.value}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Gender */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Male", value: data.students.male },
            { label: "Female", value: data.students.female },
          ].map((s) => (
            <div key={s.label} className="bg-brand-purple-950/60 rounded-xl p-4 text-center border border-brand-gold-400/30">
              <p className="text-white font-black text-3xl">{s.value}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Level Breakdown */}
        <h3 className="font-black text-white text-xs uppercase tracking-widest mb-3">Level Distribution</h3>
        <div className="space-y-3">
          {[
            { level: "100", count: data.students.level100, name: "Christian Living" },
            { level: "200", count: data.students.level200, name: "Nurturing" },
            { level: "300", count: data.students.level300, name: "Administration" },
            { level: "400", count: data.students.level400, name: "Leadership" },
          ].map((item) => {
            const percentage = data.students.total > 0
              ? Math.round((item.count / data.students.total) * 100) : 0;
            return (
              <div key={item.level}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-semibold">Level {item.level} — {item.name}</span>
                  <span className="text-white font-black text-sm">{item.count} ({percentage}%)</span>
                </div>
                <div className="w-full h-3 bg-brand-purple-950/60 rounded-full overflow-hidden border border-brand-gold-400/20">
                  <div className="h-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 2: ATTENDANCE ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <h2 className="font-heading text-base font-black text-white mb-4">✅ Attendance Report</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Sessions", value: data.attendance.totalSessions },
            { label: "Total Records", value: data.attendance.totalRecords },
            { label: "Present", value: data.attendance.presentCount },
            { label: "Average Rate", value: `${data.attendance.averageRate}%` },
          ].map((s) => (
            <div key={s.label} className="bg-brand-purple-950/60 rounded-xl p-4 text-center border border-brand-gold-400/30">
              <p className="text-white font-black text-3xl">{s.value}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 3: ASSIGNMENTS ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <h2 className="font-heading text-base font-black text-white mb-4">📝 Assignment Report</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Assignments", value: data.assignments.totalAssignments },
            { label: "Submissions", value: data.assignments.totalSubmissions },
            { label: "Graded", value: data.assignments.gradedSubmissions },
            { label: "Grading Rate", value: `${data.assignments.gradingRate}%` },
          ].map((s) => (
            <div key={s.label} className="bg-brand-purple-950/60 rounded-xl p-4 text-center border border-brand-gold-400/30">
              <p className="text-white font-black text-3xl">{s.value}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 4: CONTENT & ENGAGEMENT ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <h2 className="font-heading text-base font-black text-white mb-4">📈 Content & Engagement</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Materials", value: data.content.materials },
            { label: "Announcements", value: data.content.announcements },
            { label: "Chat Messages", value: data.content.chatMessages },
          ].map((s) => (
            <div key={s.label} className="bg-brand-purple-950/60 rounded-xl p-4 text-center border border-brand-gold-400/30">
              <p className="text-white font-black text-3xl">{s.value}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}