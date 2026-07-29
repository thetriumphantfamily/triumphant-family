// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN STUDENTS CLIENT — Approve/reject/manage students
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Student {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string | null;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  photo_url: string | null;
  level: string;
  department: string | null;
  years_in_ministry: number;
  next_of_kin_name: string | null;
  next_of_kin_phone: string | null;
  batch: string;
  status: string;
  graduation_status: string;
  created_at: string;
}

type FilterType = "all" | "pending" | "approved" | "rejected";

const LEVEL_NAMES: Record<string, string> = {
  "100": "School of Triumphant Christian Living",
  "200": "School of Nurturing",
  "300": "School of Church Administration",
  "400": "School of Spiritual Leadership & Ministry",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TDAAdminStudentsClient() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tda_students")
        .select("*")
        .order("created_at", { ascending: false });

      setStudents(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  const updateStatus = async (
    studentId: string,
    newStatus: "approved" | "rejected" | "pending"
  ) => {
    setBusyId(studentId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("tda_students")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", studentId);

      if (error) {
        toast.error("Failed to update status");
        setBusyId(null);
        return;
      }

      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, status: newStatus } : s
        )
      );

      const message =
        newStatus === "approved"
          ? "✅ Student approved!"
          : newStatus === "rejected"
          ? "❌ Student rejected"
          : "⏳ Reset to pending";

      toast.success(message);

      // Update selected student if open
      if (selectedStudent?.id === studentId) {
        setSelectedStudent({ ...selectedStudent, status: newStatus });
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const deleteStudent = async (studentId: string, name: string) => {
    if (!confirm(`Permanently delete ${name}? This cannot be undone.`)) return;

    setBusyId(studentId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("tda_students")
        .delete()
        .eq("id", studentId);

      if (error) {
        toast.error("Failed to delete");
        setBusyId(null);
        return;
      }

      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      toast.success("🗑️ Student deleted");
      setSelectedStudent(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesFilter = filter === "all" || s.status === filter;
    const matchesSearch =
      !searchQuery ||
      s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: students.length,
    pending: students.filter((s) => s.status === "pending").length,
    approved: students.filter((s) => s.status === "approved").length,
    rejected: students.filter((s) => s.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
          👥 Manage Students
        </h1>
        <p className="text-gray-600 text-sm">
          Approve registrations, view profiles, and manage student records
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
            Total
          </p>
          <p className="text-3xl font-bold text-brand-purple-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-yellow-200 shadow-md">
          <p className="text-xs text-yellow-600 uppercase font-semibold mb-1">
            Pending
          </p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-green-200 shadow-md">
          <p className="text-xs text-green-600 uppercase font-semibold mb-1">
            Approved
          </p>
          <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-red-200 shadow-md">
          <p className="text-xs text-red-600 uppercase font-semibold mb-1">
            Rejected
          </p>
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, student ID, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "approved", "rejected"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all capitalize ${
              filter === f
                ? "bg-brand-purple-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
            }`}
          >
            {f === "all" ? "All Students" : f} (
            {f === "all" ? stats.total : stats[f]})
          </button>
        ))}
      </div>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
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
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            {searchQuery ? "No students match your search" : "No students yet"}
          </h3>
          <p className="text-gray-500">
            {searchQuery
              ? "Try a different search term"
              : "Students will appear here once they register"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const isBusy = busyId === student.id;
            const statusColor =
              student.status === "approved"
                ? "bg-green-100 text-green-700 border-green-300"
                : student.status === "rejected"
                ? "bg-red-100 text-red-700 border-red-300"
                : "bg-yellow-100 text-yellow-700 border-yellow-300";

            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md hover:shadow-lg hover:border-brand-purple-300 transition-all cursor-pointer"
                onClick={() => setSelectedStudent(student)}
              >
                <div className="flex items-start gap-3 mb-3">
                  {student.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={student.photo_url}
                      alt={student.full_name}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-brand-gold-400 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-bold text-xl flex-shrink-0">
                      {student.full_name.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-brand-purple-900 truncate">
                      {student.full_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {student.student_id}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Level {student.level}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor} capitalize`}
                  >
                    {student.status}
                  </span>
                </div>

                <div className="text-xs text-gray-500 mb-3 space-y-1">
                  <p className="truncate">📧 {student.email}</p>
                  <p className="truncate">📱 {student.phone}</p>
                  <p>📅 Joined {formatDate(student.created_at)}</p>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  {student.status === "pending" && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(student.id, "approved");
                        }}
                        disabled={isBusy}
                        className="flex-1 px-3 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-all disabled:opacity-50"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(student.id, "rejected");
                        }}
                        disabled={isBusy}
                        className="flex-1 px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all disabled:opacity-50"
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                  {student.status === "approved" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(student.id, "rejected");
                      }}
                      disabled={isBusy}
                      className="flex-1 px-3 py-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      🚫 Deactivate
                    </button>
                  )}
                  {student.status === "rejected" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(student.id, "approved");
                      }}
                      disabled={isBusy}
                      className="flex-1 px-3 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-all disabled:opacity-50"
                    >
                      ✅ Re-approve
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStudent(student);
                    }}
                    className="px-3 py-1.5 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-xs font-bold transition-all"
                  >
                    👁️ View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ━━━ STUDENT DETAIL MODAL ━━━ */}
      {selectedStudent && (
        <>
          <div
            onClick={() => setSelectedStudent(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {selectedStudent.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={selectedStudent.photo_url}
                        alt={selectedStudent.full_name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-gold-400"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-bold text-2xl">
                        {selectedStudent.full_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h2 className="font-heading text-xl font-bold text-brand-purple-900">
                        {selectedStudent.full_name}
                      </h2>
                      <p className="text-sm text-brand-gold-600 font-semibold">
                        {selectedStudent.student_id}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700">
                    Status:
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border capitalize ${
                      selectedStudent.status === "approved"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : selectedStudent.status === "rejected"
                        ? "bg-red-100 text-red-700 border-red-300"
                        : "bg-yellow-100 text-yellow-700 border-yellow-300"
                    }`}
                  >
                    {selectedStudent.status}
                  </span>
                </div>

                {/* Personal Info */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="font-bold text-brand-purple-900 mb-3 text-sm uppercase tracking-widest">
                    Personal
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Email</p>
                      <p className="font-semibold text-gray-800 break-all">
                        {selectedStudent.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Phone</p>
                      <p className="font-semibold text-gray-800">
                        {selectedStudent.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Gender</p>
                      <p className="font-semibold text-gray-800 capitalize">
                        {selectedStudent.gender || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Date of Birth</p>
                      <p className="font-semibold text-gray-800">
                        {selectedStudent.date_of_birth
                          ? formatDate(selectedStudent.date_of_birth)
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="font-bold text-brand-purple-900 mb-3 text-sm uppercase tracking-widest">
                    Location
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Address</p>
                      <p className="font-semibold text-gray-800">
                        {selectedStudent.address || "—"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-gray-500 text-xs">City</p>
                        <p className="font-semibold text-gray-800">
                          {selectedStudent.city || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">State</p>
                        <p className="font-semibold text-gray-800">
                          {selectedStudent.state || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="font-bold text-brand-purple-900 mb-3 text-sm uppercase tracking-widest">
                    Academic
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Course Level</p>
                      <p className="font-semibold text-gray-800">
                        Level {selectedStudent.level}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {LEVEL_NAMES[selectedStudent.level]}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Batch</p>
                      <p className="font-semibold text-gray-800">
                        {selectedStudent.batch}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Department</p>
                      <p className="font-semibold text-gray-800">
                        {selectedStudent.department || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Years in Ministry</p>
                      <p className="font-semibold text-gray-800">
                        {selectedStudent.years_in_ministry} years
                      </p>
                    </div>
                  </div>
                </div>

                {/* Next of Kin */}
                {(selectedStudent.next_of_kin_name ||
                  selectedStudent.next_of_kin_phone) && (
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <h3 className="font-bold text-brand-purple-900 mb-3 text-sm uppercase tracking-widest">
                      Next of Kin
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Name</p>
                        <p className="font-semibold text-gray-800">
                          {selectedStudent.next_of_kin_name || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Phone</p>
                        <p className="font-semibold text-gray-800">
                          {selectedStudent.next_of_kin_phone || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Registered Date */}
                <p className="text-xs text-gray-500 text-center">
                  Registered on {formatDate(selectedStudent.created_at)}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-gray-100">
                  {selectedStudent.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(selectedStudent.id, "approved")
                        }
                        disabled={busyId === selectedStudent.id}
                        className="flex-1 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold transition-all disabled:opacity-50"
                      >
                        ✅ Approve Student
                      </button>
                      <button
                        onClick={() =>
                          updateStatus(selectedStudent.id, "rejected")
                        }
                        disabled={busyId === selectedStudent.id}
                        className="flex-1 px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold transition-all disabled:opacity-50"
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                  {selectedStudent.status === "approved" && (
                    <button
                      onClick={() =>
                        updateStatus(selectedStudent.id, "rejected")
                      }
                      disabled={busyId === selectedStudent.id}
                      className="flex-1 px-6 py-3 rounded-full bg-red-100 hover:bg-red-200 text-red-700 font-bold transition-all disabled:opacity-50"
                    >
                      🚫 Deactivate Student
                    </button>
                  )}
                  {selectedStudent.status === "rejected" && (
                    <button
                      onClick={() =>
                        updateStatus(selectedStudent.id, "approved")
                      }
                      disabled={busyId === selectedStudent.id}
                      className="flex-1 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold transition-all disabled:opacity-50"
                    >
                      ✅ Re-approve Student
                    </button>
                  )}
                  <button
                    onClick={() =>
                      deleteStudent(selectedStudent.id, selectedStudent.full_name)
                    }
                    disabled={busyId === selectedStudent.id}
                    className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold transition-all disabled:opacity-50"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}