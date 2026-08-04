// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN STUDENTS CLIENT – Approve/reject/manage students
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

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
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function TDAAdminStudentsClient() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tda_students").select("*").order("created_at", { ascending: false });
      setStudents(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const updateStatus = async (studentId: string, newStatus: "approved" | "rejected" | "pending") => {
    setBusyId(studentId);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tda_students").update({
        status: newStatus, updated_at: new Date().toISOString(),
      }).eq("id", studentId);

      if (error) { toast.error("Failed to update status"); setBusyId(null); return; }

      setStudents((prev) => prev.map((s) => s.id === studentId ? { ...s, status: newStatus } : s));
      toast.success(newStatus === "approved" ? "✅ Student approved!" : newStatus === "rejected" ? "❌ Student rejected" : "⏳ Reset to pending");
      if (selectedStudent?.id === studentId) setSelectedStudent({ ...selectedStudent, status: newStatus });
    } catch { toast.error("Update failed"); }
    finally { setBusyId(null); }
  };

  const deleteStudent = async (studentId: string, name: string) => {
    if (!confirm(`Permanently delete ${name}? This cannot be undone.`)) return;
    setBusyId(studentId);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tda_students").delete().eq("id", studentId);
      if (error) { toast.error("Failed to delete"); setBusyId(null); return; }
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      toast.success("🗑️ Student deleted");
      setSelectedStudent(null);
    } catch { toast.error("Delete failed"); }
    finally { setBusyId(null); }
  };

  const filteredStudents = students.filter((s) => {
    const matchesFilter = filter === "all" || s.status === filter;
    const matchesSearch = !searchQuery ||
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

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading students..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Page Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Students</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
            👥 Manage Students
          </h1>
          <p className="text-brand-purple-200 text-sm">
            Approve registrations, view profiles, and manage student records.
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, border: "border-brand-gold-400/40" },
          { label: "Pending", value: stats.pending, border: "border-brand-gold-400/60", badge: stats.pending > 0 },
          { label: "Approved", value: stats.approved, border: "border-green-400/40" },
          { label: "Rejected", value: stats.rejected, border: "border-red-400/40" },
        ].map((s) => (
          <div key={s.label} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${s.border} p-4 shadow-xl`}>
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            {s.badge && (
              <div className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span className="text-white text-[9px] font-bold">NEW</span>
              </div>
            )}
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">{s.label}</p>
            <p className="text-white font-black text-3xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, email, student ID, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
        />
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "approved", "rejected"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-black transition-all capitalize ${
              filter === f
                ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                : "bg-white text-brand-purple-900"
            }`}
          >
            {f === "all" ? "All Students" : f} ({f === "all" ? stats.total : stats[f as keyof typeof stats]})
          </button>
        ))}
      </div>

      {/* ── Students Grid ── */}
      {filteredStudents.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">👥</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">
            {searchQuery ? "No students match your search" : "No students yet"}
          </h3>
          <p className="text-brand-purple-200 text-sm">
            {searchQuery ? "Try a different search term" : "Students will appear here once they register"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const isBusy = busyId === student.id;
            return (
              <div
                key={student.id}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 p-5 shadow-xl transition-all cursor-pointer active:scale-95"
                onClick={() => setSelectedStudent(student)}
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="flex items-start gap-3 mb-3">
                  {student.photo_url ? (
                    <img src={student.photo_url} alt={student.full_name} className="w-12 h-12 rounded-xl object-cover border-2 border-brand-gold-400/40 flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-brand-purple-950/80 border-2 border-brand-gold-400/40 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                      {student.full_name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-white truncate text-sm">{student.full_name}</p>
                    <p className="text-brand-purple-200 text-xs truncate">{student.student_id}</p>
                    <p className="text-brand-purple-200 text-xs">Level {student.level}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black capitalize flex-shrink-0 border ${
                    student.status === "approved" ? "bg-green-500/20 text-green-300 border-green-400/40" :
                    student.status === "rejected" ? "bg-red-500/20 text-red-300 border-red-400/40" :
                    "bg-brand-purple-950/60 text-white border-brand-gold-400/40"
                  }`}>
                    {student.status}
                  </span>
                </div>

                <div className="text-xs text-brand-purple-200 mb-3 space-y-0.5">
                  <p className="truncate">📧 {student.email}</p>
                  <p>📱 {student.phone}</p>
                  <p>📅 Joined {formatDate(student.created_at)}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-3 border-t border-brand-gold-400/30">
                  {student.status === "pending" && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(student.id, "approved"); }}
                        disabled={isBusy}
                        className="w-full py-2 rounded-xl bg-green-600 text-white text-xs font-black disabled:opacity-50 active:scale-95 transition-all"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(student.id, "rejected"); }}
                        disabled={isBusy}
                        className="w-full py-2 rounded-xl bg-red-600 text-white text-xs font-black disabled:opacity-50 active:scale-95 transition-all"
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                  {student.status === "approved" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); updateStatus(student.id, "rejected"); }}
                      disabled={isBusy}
                      className="w-full py-2 rounded-xl bg-brand-purple-950/60 text-white text-xs font-bold border border-brand-gold-400/40 disabled:opacity-50"
                    >
                      🚫 Deactivate
                    </button>
                  )}
                  {student.status === "rejected" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); updateStatus(student.id, "approved"); }}
                      disabled={isBusy}
                      className="w-full py-2 rounded-xl bg-green-600 text-white text-xs font-black disabled:opacity-50 active:scale-95 transition-all"
                    >
                      ✅ Re-approve
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedStudent(student); }}
                    className="w-full py-2 rounded-xl bg-white text-brand-purple-900 text-xs font-black active:scale-95 transition-all"
                  >
                    👁️ View Full Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Student Detail Modal — KEEP bg-white — slides up mobile ── */}
      {selectedStudent && (
        <>
          <div onClick={() => setSelectedStudent(null)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-2xl pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {selectedStudent.photo_url ? (
                      <img src={selectedStudent.photo_url} alt={selectedStudent.full_name} className="w-14 h-14 rounded-2xl object-cover border-2 border-gray-200" />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-brand-purple-100 flex items-center justify-center text-brand-purple-900 font-bold text-2xl">
                        {selectedStudent.full_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h2 className="font-heading text-lg font-bold text-brand-purple-900">{selectedStudent.full_name}</h2>
                      <p className="text-sm text-brand-purple-600 font-semibold">{selectedStudent.student_id}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedStudent(null)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700">Status:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black capitalize border ${
                    selectedStudent.status === "approved" ? "bg-green-100 text-green-700 border-green-300" :
                    selectedStudent.status === "rejected" ? "bg-red-100 text-red-700 border-red-300" :
                    "bg-gray-100 text-gray-700 border-gray-300"
                  }`}>
                    {selectedStudent.status}
                  </span>
                </div>

                {/* Personal Info */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <h3 className="font-bold text-brand-purple-900 mb-3 text-xs uppercase tracking-widest">Personal</h3>
                  <div className="space-y-2 text-sm">
                    <div><p className="text-gray-500 text-xs">Email</p><p className="font-semibold text-gray-800 break-all">{selectedStudent.email}</p></div>
                    <div><p className="text-gray-500 text-xs">Phone</p><p className="font-semibold text-gray-800">{selectedStudent.phone}</p></div>
                    <div><p className="text-gray-500 text-xs">Gender</p><p className="font-semibold text-gray-800 capitalize">{selectedStudent.gender || "—"}</p></div>
                    <div><p className="text-gray-500 text-xs">Date of Birth</p><p className="font-semibold text-gray-800">{selectedStudent.date_of_birth ? formatDate(selectedStudent.date_of_birth) : "—"}</p></div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <h3 className="font-bold text-brand-purple-900 mb-3 text-xs uppercase tracking-widest">Location</h3>
                  <div className="space-y-2 text-sm">
                    <div><p className="text-gray-500 text-xs">Address</p><p className="font-semibold text-gray-800">{selectedStudent.address || "—"}</p></div>
                    <div><p className="text-gray-500 text-xs">City / State</p><p className="font-semibold text-gray-800">{[selectedStudent.city, selectedStudent.state].filter(Boolean).join(", ") || "—"}</p></div>
                  </div>
                </div>

                {/* Academic */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <h3 className="font-bold text-brand-purple-900 mb-3 text-xs uppercase tracking-widest">Academic</h3>
                  <div className="space-y-2 text-sm">
                    <div><p className="text-gray-500 text-xs">Course Level</p><p className="font-semibold text-gray-800">Level {selectedStudent.level} — {LEVEL_NAMES[selectedStudent.level]}</p></div>
                    <div><p className="text-gray-500 text-xs">Batch</p><p className="font-semibold text-gray-800">{selectedStudent.batch}</p></div>
                    <div><p className="text-gray-500 text-xs">Department</p><p className="font-semibold text-gray-800">{selectedStudent.department || "—"}</p></div>
                    <div><p className="text-gray-500 text-xs">Years in Ministry</p><p className="font-semibold text-gray-800">{selectedStudent.years_in_ministry} years</p></div>
                  </div>
                </div>

                {/* Next of Kin */}
                {(selectedStudent.next_of_kin_name || selectedStudent.next_of_kin_phone) && (
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <h3 className="font-bold text-brand-purple-900 mb-3 text-xs uppercase tracking-widest">Next of Kin</h3>
                    <div className="space-y-2 text-sm">
                      <div><p className="text-gray-500 text-xs">Name</p><p className="font-semibold text-gray-800">{selectedStudent.next_of_kin_name || "—"}</p></div>
                      <div><p className="text-gray-500 text-xs">Phone</p><p className="font-semibold text-gray-800">{selectedStudent.next_of_kin_phone || "—"}</p></div>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center">
                  Registered on {formatDate(selectedStudent.created_at)}
                </p>

                {/* Action Buttons — full width stacked */}
                <div className="flex flex-col gap-3 pt-4 border-t-2 border-gray-100">
                  {selectedStudent.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(selectedStudent.id, "approved")}
                        disabled={busyId === selectedStudent.id}
                        className="w-full py-4 rounded-xl bg-green-600 text-white font-black disabled:opacity-50 active:scale-95 transition-all"
                      >
                        ✅ Approve Student
                      </button>
                      <button
                        onClick={() => updateStatus(selectedStudent.id, "rejected")}
                        disabled={busyId === selectedStudent.id}
                        className="w-full py-4 rounded-xl bg-red-600 text-white font-black disabled:opacity-50 active:scale-95 transition-all"
                      >
                        ❌ Reject Student
                      </button>
                    </>
                  )}
                  {selectedStudent.status === "approved" && (
                    <button
                      onClick={() => updateStatus(selectedStudent.id, "rejected")}
                      disabled={busyId === selectedStudent.id}
                      className="w-full py-4 rounded-xl bg-brand-purple-100 text-brand-purple-900 font-black disabled:opacity-50"
                    >
                      🚫 Deactivate Student
                    </button>
                  )}
                  {selectedStudent.status === "rejected" && (
                    <button
                      onClick={() => updateStatus(selectedStudent.id, "approved")}
                      disabled={busyId === selectedStudent.id}
                      className="w-full py-4 rounded-xl bg-green-600 text-white font-black disabled:opacity-50 active:scale-95 transition-all"
                    >
                      ✅ Re-approve Student
                    </button>
                  )}
                  <button
                    onClick={() => deleteStudent(selectedStudent.id, selectedStudent.full_name)}
                    disabled={busyId === selectedStudent.id}
                    className="w-full py-4 rounded-xl bg-red-600 text-white font-black disabled:opacity-50 active:scale-95 transition-all"
                  >
                    🗑️ Permanently Delete
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