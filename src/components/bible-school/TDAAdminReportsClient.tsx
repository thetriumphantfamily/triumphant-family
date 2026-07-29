// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN REPORTS CLIENT — School analytics and statistics
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ReportData {
  students: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    graduated: number;
    male: number;
    female: number;
    level100: number;
    level200: number;
    level300: number;
    level400: number;
  };
  attendance: {
    totalSessions: number;
    totalRecords: number;
    presentCount: number;
    averageRate: number;
  };
  assignments: {
    totalAssignments: number;
    totalSubmissions: number;
    gradedSubmissions: number;
    gradingRate: number;
  };
  content: {
    materials: number;
    announcements: number;
    chatMessages: number;
  };
}

export default function TDAAdminReportsClient() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const supabase = createClient();

      const [
        totalStudents,
        approvedStudents,
        pendingStudents,
        rejectedStudents,
        graduatedStudents,
        maleStudents,
        femaleStudents,
        level100,
        level200,
        level300,
        level400,
        totalSessions,
        totalAttendance,
        presentAttendance,
        totalAssignments,
        totalSubmissions,
        gradedSubmissions,
        totalMaterials,
        totalAnnouncements,
        totalChat,
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
          level100: level100.count || 0,
          level200: level200.count || 0,
          level300: level300.count || 0,
          level400: level400.count || 0,
        },
        attendance: {
          totalSessions: totalSessions.count || 0,
          totalRecords: totalAttendanceCount,
          presentCount: presentCount,
          averageRate:
            totalAttendanceCount > 0
              ? Math.round((presentCount / totalAttendanceCount) * 100)
              : 0,
        },
        assignments: {
          totalAssignments: totalAssignments.count || 0,
          totalSubmissions: totalSubmissionsCount,
          gradedSubmissions: gradedCount,
          gradingRate:
            totalSubmissionsCount > 0
              ? Math.round((gradedCount / totalSubmissionsCount) * 100)
              : 0,
        },
        content: {
          materials: totalMaterials.count || 0,
          announcements: totalAnnouncements.count || 0,
          chatMessages: totalChat.count || 0,
        },
      });

      setLoading(false);
    } catch (err) {
      console.error("Reports error:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading reports...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
          📊 Reports & Analytics
        </h1>
        <p className="text-gray-600 text-sm">
          Comprehensive overview of your Bible School data
        </p>
      </div>

      {/* ━━━ SECTION 1: STUDENT STATISTICS ━━━ */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border-2 border-gray-100 shadow-md">
        <h2 className="font-heading text-xl font-bold text-brand-purple-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">👥</span>
          Student Statistics
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-brand-purple-50 rounded-xl p-4 text-center border-2 border-brand-purple-100">
            <p className="text-3xl font-bold text-brand-purple-900">
              {data.students.total}
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Total
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center border-2 border-green-200">
            <p className="text-3xl font-bold text-green-600">
              {data.students.approved}
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Approved
            </p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 text-center border-2 border-yellow-200">
            <p className="text-3xl font-bold text-yellow-600">
              {data.students.pending}
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Pending
            </p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center border-2 border-red-200">
            <p className="text-3xl font-bold text-red-600">
              {data.students.rejected}
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Rejected
            </p>
          </div>
          <div className="bg-brand-gold-50 rounded-xl p-4 text-center border-2 border-brand-gold-200">
            <p className="text-3xl font-bold text-brand-gold-600">
              {data.students.graduated}
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Graduated
            </p>
          </div>
        </div>

        {/* Gender */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center border-2 border-blue-200">
            <p className="text-3xl font-bold text-blue-600">
              {data.students.male}
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Male
            </p>
          </div>
          <div className="bg-pink-50 rounded-xl p-4 text-center border-2 border-pink-200">
            <p className="text-3xl font-bold text-pink-600">
              {data.students.female}
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Female
            </p>
          </div>
        </div>

        {/* Level Breakdown */}
        <h3 className="font-bold text-brand-purple-900 mb-3 text-sm uppercase tracking-widest">
          Level Distribution
        </h3>
        <div className="space-y-3">
          {[
            { level: "100", count: data.students.level100, name: "Christian Living", color: "bg-blue-500" },
            { level: "200", count: data.students.level200, name: "Nurturing", color: "bg-green-500" },
            { level: "300", count: data.students.level300, name: "Administration", color: "bg-purple-500" },
            { level: "400", count: data.students.level400, name: "Leadership", color: "bg-red-500" },
          ].map((item) => {
            const percentage =
              data.students.total > 0
                ? Math.round((item.count / data.students.total) * 100)
                : 0;

            return (
              <div key={item.level}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700">
                    Level {item.level} — {item.name}
                  </span>
                  <span className="text-sm font-bold text-brand-purple-900">
                    {item.count} ({percentage}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ━━━ SECTION 2: ATTENDANCE ━━━ */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border-2 border-gray-100 shadow-md">
        <h2 className="font-heading text-xl font-bold text-brand-purple-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">✅</span>
          Attendance Report
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-xl p-4 text-center border-2 border-gray-200">
            <p className="text-3xl font-bold text-brand-purple-900">
              {data.attendance.totalSessions}
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Total Sessions
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center border-2 border-gray-200">
            <p className="text-3xl font-bold text-brand-purple-900">
              {data.attendance.totalRecords}
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Total Records
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center border-2 border-green-200">
            <p className="text-3xl font-bold text-green-600">
              {data.attendance.presentCount}
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Present
            </p>
          </div>
          <div className="bg-brand-gold-50 rounded-xl p-4 text-center border-2 border-brand-gold-200">
            <p className="text-3xl font-bold text-brand-gold-600">
              {data.attendance.averageRate}%
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Average Rate
            </p>
          </div>
        </div>
      </div>

      {/* ━━━ SECTION 3: ASSIGNMENTS ━━━ */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border-2 border-gray-100 shadow-md">
        <h2 className="font-heading text-xl font-bold text-brand-purple-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">📝</span>
          Assignment Report
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-xl p-4 text-center border-2 border-gray-200">
            <p className="text-3xl font-bold text-brand-purple-900">
              {data.assignments.totalAssignments}
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Assignments
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border-2 border-blue-200">
            <p className="text-3xl font-bold text-blue-600">
              {data.assignments.totalSubmissions}
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Submissions
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center border-2 border-green-200">
            <p className="text-3xl font-bold text-green-600">
              {data.assignments.gradedSubmissions}
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Graded
            </p>
          </div>
          <div className="bg-brand-gold-50 rounded-xl p-4 text-center border-2 border-brand-gold-200">
            <p className="text-3xl font-bold text-brand-gold-600">
              {data.assignments.gradingRate}%
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Grading Rate
            </p>
          </div>
        </div>
      </div>

      {/* ━━━ SECTION 4: CONTENT & ENGAGEMENT ━━━ */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border-2 border-gray-100 shadow-md">
        <h2 className="font-heading text-xl font-bold text-brand-purple-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">📈</span>
          Content & Engagement
        </h2>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-brand-purple-50 rounded-xl p-4 text-center border-2 border-brand-purple-100">
            <p className="text-3xl font-bold text-brand-purple-900">
              {data.content.materials}
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Materials
            </p>
          </div>
          <div className="bg-brand-purple-50 rounded-xl p-4 text-center border-2 border-brand-purple-100">
            <p className="text-3xl font-bold text-brand-purple-900">
              {data.content.announcements}
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Announcements
            </p>
          </div>
          <div className="bg-brand-purple-50 rounded-xl p-4 text-center border-2 border-brand-purple-100">
            <p className="text-3xl font-bold text-brand-purple-900">
              {data.content.chatMessages}
            </p>
            <p className="text-xs text-gray-600 font-semibold uppercase mt-1">
              Chat Messages
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}