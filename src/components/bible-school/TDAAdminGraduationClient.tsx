// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN GRADUATION CLIENT – Graduate students with awards + notify
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";
import { notifyTDAStudent } from "@/lib/tda-notifications";

interface Student {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  photo_url: string | null;
  level: string;
  batch: string;
  status: string;
  graduation_status: string;
  graduation_date: string | null;
  graduation_batch: string | null;
  graduation_notes: string | null;
  awards: string[];
}

const AVAILABLE_AWARDS = [
  { key: "Best Student", icon: "🏆", label: "Best Student" },
  { key: "Most Improved", icon: "📈", label: "Most Improved" },
  { key: "Perfect Attendance", icon: "📅", label: "Perfect Attendance" },
  { key: "Best in Assignments", icon: "⭐", label: "Best in Assignments" },
  { key: "Most Faithful", icon: "✝️", label: "Most Faithful" },
  { key: "Excellence in Service", icon: "🙌", label: "Excellence in Service" },
];

const LEVEL_NAMES: Record<string, string> = {
  "100": "Christian Living",
  "200": "Nurturing",
  "300": "Administration",
  "400": "Leadership",
};

type FilterType = "all" | "eligible" | "graduated" | "not_graduated";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function TDAAdminGraduationClient() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [graduatingStudent, setGraduatingStudent] = useState<Student | null>(null);
  const [gradForm, setGradForm] = useState({
    graduation_batch: "", graduation_date: new Date().toISOString().split("T")[0],
    graduation_notes: "", awards: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tda_students").select("*").eq("status", "approved").order("full_name", { ascending: true });
      setStudents(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const openGraduateModal = (student: Student) => {
    setGraduatingStudent(student);
    setGradForm({
      graduation_batch: student.graduation_batch || student.batch,
      graduation_date: student.graduation_date || new Date().toISOString().split("T")[0],
      graduation_notes: student.graduation_notes || "",
      awards: student.awards || [],
    });
  };

  const toggleAward = (awardKey: string) => {
    setGradForm((prev) => ({
      ...prev,
      awards: prev.awards.includes(awardKey)
        ? prev.awards.filter((a) => a !== awardKey)
        : [...prev.awards, awardKey],
    }));
  };

  const handleGraduate = async () => {
    if (!graduatingStudent) return;
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tda_students").update({
        graduation_status: "graduated",
        graduation_date: gradForm.graduation_date,
        graduation_batch: gradForm.graduation_batch.trim() || null,
        graduation_notes: gradForm.graduation_notes.trim() || null,
        awards: gradForm.awards,
        updated_at: new Date().toISOString(),
      }).eq("id", graduatingStudent.id);

      if (error) { toast.error(`Failed: ${error.message}`); setIsSubmitting(false); return; }

      // ✅ NOTIFY STUDENT
      await notifyTDAStudent({
        studentId: graduatingStudent.id,
        title: "🎓 Congratulations! You Have Graduated!",
        message: `You have successfully completed the School of ${LEVEL_NAMES[graduatingStudent.level]} at Triumphant Disciples Academy. Your certificate is now available! Congratulations, ${graduatingStudent.full_name.split(" ")[0]}!`,
        type: "graduation",
        link: "/bible-school/portal/certificate",
      });

      toast.success("🎓 Student graduated and notified!");
      setGraduatingStudent(null);
      loadStudents();
    } catch { toast.error("Failed to graduate"); }
    finally { setIsSubmitting(false); }
  };

  const handleRevoke = async (studentId: string, name: string) => {
    if (!confirm(`Revoke graduation for ${name}?`)) return;
    setBusyId(studentId);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tda_students").update({
        graduation_status: "not_graduated", graduation_date: null,
        graduation_batch: null, graduation_notes: null, awards: [],
        updated_at: new Date().toISOString(),
      }).eq("id", studentId);
      if (error) { toast.error("Failed to revoke"); setBusyId(null); return; }
      toast.success("🔄 Graduation revoked");
      loadStudents();
    } catch { toast.error("Failed to revoke"); }
    finally { setBusyId(null); }
  };

  const filteredStudents = students.filter((s) => {
    const matchesFilter = filter === "all" ||
      (filter === "graduated" && s.graduation_status === "graduated") ||
      (filter === "not_graduated" && s.graduation_status !== "graduated") ||
      (filter === "eligible" && s.graduation_status !== "graduated");
    const matchesSearch = !searchQuery ||
      s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.student_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: students.length,
    graduated: students.filter((s) => s.graduation_status === "graduated").length,
    notGraduated: students.filter((s) => s.graduation_status !== "graduated").length,
  };

  if (loading) return <LoadingScreen message="Loading students..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Page Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Graduation</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
            🎓 Graduation Management
          </h1>
          <p className="text-brand-purple-200 text-sm">
            Review eligibility, approve graduation, and assign awards.
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Approved", value: stats.total, border: "border-brand-gold-400/40" },
          { label: "Graduated", value: stats.graduated, border: "border-green-400/40" },
          { label: "In Progress", value: stats.notGraduated, border: "border-brand-gold-400/40" },
        ].map((s) => (
          <div key={s.label} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${s.border} p-4 shadow-xl`}>
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
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
        <input type="text" placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex flex-wrap gap-2">
        {([
          { value: "all", label: "All Students" },
          { value: "not_graduated", label: "In Progress" },
          { value: "graduated", label: "Graduated" },
        ] as { value: FilterType; label: string }[]).map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-black transition-all ${
              filter === f.value
                ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                : "bg-white text-brand-purple-900"
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Students Grid ── */}
      {filteredStudents.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h3 className="font-heading text-xl font-bold text-white mb-2">No students found</h3>
          <p className="text-brand-purple-200 text-sm">Try a different filter or search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((student) => {
            const isGraduated = student.graduation_status === "graduated";
            const isBusy = busyId === student.id;
            return (
              <div key={student.id} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                isGraduated ? "border-green-400/40" : "border-brand-gold-400/40"
              } p-5 shadow-xl`}>
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
                    <p className="text-brand-purple-200 text-xs">{student.student_id} • Level {student.level} — {LEVEL_NAMES[student.level]}</p>
                    <p className="text-brand-purple-200 text-xs">{student.batch}</p>
                  </div>
                  {isGraduated ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 text-[10px] font-black border border-green-400/40 flex-shrink-0">🎓 Graduated</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-purple-950/60 text-white text-[10px] font-black border border-brand-gold-400/40 flex-shrink-0">📚 In Progress</span>
                  )}
                </div>

                {isGraduated && student.awards && student.awards.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {student.awards.map((award, i) => {
                      const awardInfo = AVAILABLE_AWARDS.find((a) => a.key === award);
                      return (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 text-white text-[10px] font-black">
                          {awardInfo?.icon} {awardInfo?.label || award}
                        </span>
                      );
                    })}
                  </div>
                )}

                {isGraduated && student.graduation_date && (
                  <p className="text-green-300 text-xs mb-3 font-semibold">
                    Graduated on {formatDate(student.graduation_date)}
                  </p>
                )}

                <div className="flex flex-col gap-2 pt-3 border-t border-brand-gold-400/30">
                  {!isGraduated && (
                    <button onClick={() => openGraduateModal(student)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 text-xs font-black shadow-gold active:scale-95 transition-all">
                      🎓 Graduate Student
                    </button>
                  )}
                  {isGraduated && (
                    <>
                      <button onClick={() => openGraduateModal(student)}
                        className="w-full py-2.5 rounded-xl bg-white text-brand-purple-900 text-xs font-black active:scale-95 transition-all">
                        ✏️ Edit Graduation
                      </button>
                      <button onClick={() => handleRevoke(student.id, student.full_name)} disabled={isBusy}
                        className="w-full py-2.5 rounded-xl bg-red-600 text-white text-xs font-black disabled:opacity-50 active:scale-95 transition-all">
                        🔄 Revoke Graduation
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── GRADUATION MODAL ── */}
      {graduatingStudent && (
        <>
          <div onClick={() => setGraduatingStudent(null)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-2xl pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {graduatingStudent.photo_url ? (
                      <img src={graduatingStudent.photo_url} alt={graduatingStudent.full_name} className="w-10 h-10 rounded-xl object-cover border-2 border-gray-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-brand-purple-100 flex items-center justify-center text-brand-purple-900 font-black text-lg">
                        {graduatingStudent.full_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h2 className="font-heading text-lg font-bold text-brand-purple-900">🎓 Graduate Student</h2>
                      <p className="text-sm text-gray-500">{graduatingStudent.full_name} — {graduatingStudent.student_id}</p>
                    </div>
                  </div>
                  <button onClick={() => setGraduatingStudent(null)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Graduation Batch / Class</label>
                  <input type="text" value={gradForm.graduation_batch} onChange={(e) => setGradForm({ ...gradForm, graduation_batch: e.target.value })}
                    placeholder="e.g. Class of 2026"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Graduation Date</label>
                  <input type="date" value={gradForm.graduation_date} onChange={(e) => setGradForm({ ...gradForm, graduation_date: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>

                {/* Awards */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">🏆 Awards (Optional)</label>
                  <div className="space-y-2">
                    {AVAILABLE_AWARDS.map((award) => {
                      const isSelected = gradForm.awards.includes(award.key);
                      return (
                        <button key={award.key} type="button" onClick={() => toggleAward(award.key)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                            isSelected ? "border-brand-purple-500 bg-brand-purple-50" : "border-gray-200 hover:border-gray-300"
                          }`}>
                          <span className="text-xl">{award.icon}</span>
                          <span className={`text-sm font-bold flex-1 ${isSelected ? "text-brand-purple-900" : "text-gray-600"}`}>
                            {award.label}
                          </span>
                          {isSelected && (
                            <svg className="w-5 h-5 text-brand-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Graduation Notes</label>
                  <textarea value={gradForm.graduation_notes} onChange={(e) => setGradForm({ ...gradForm, graduation_notes: e.target.value })}
                    placeholder="Personal message or commendation..." rows={4}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button onClick={handleGraduate} disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                    {isSubmitting ? "Processing..." : "🎓 Confirm Graduation"}
                  </button>
                  <button onClick={() => setGraduatingStudent(null)} className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}