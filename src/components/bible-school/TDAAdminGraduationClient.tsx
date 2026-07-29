// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN GRADUATION CLIENT — Graduate students with awards
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
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TDAAdminGraduationClient() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  // Graduation modal
  const [graduatingStudent, setGraduatingStudent] = useState<Student | null>(null);
  const [gradForm, setGradForm] = useState({
    graduation_batch: "",
    graduation_date: new Date().toISOString().split("T")[0],
    graduation_notes: "",
    awards: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tda_students")
        .select("*")
        .eq("status", "approved")
        .order("full_name", { ascending: true });

      setStudents(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  const openGraduateModal = (student: Student) => {
    setGraduatingStudent(student);
    setGradForm({
      graduation_batch: student.graduation_batch || student.batch,
      graduation_date:
        student.graduation_date || new Date().toISOString().split("T")[0],
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

      const { error } = await supabase
        .from("tda_students")
        .update({
          graduation_status: "graduated",
          graduation_date: gradForm.graduation_date,
          graduation_batch: gradForm.graduation_batch.trim() || null,
          graduation_notes: gradForm.graduation_notes.trim() || null,
          awards: gradForm.awards,
          updated_at: new Date().toISOString(),
        })
        .eq("id", graduatingStudent.id);

      if (error) {
        toast.error(`Failed: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      toast.success("🎓 Student graduated successfully!");
      setGraduatingStudent(null);
      loadStudents();
      setIsSubmitting(false);
    } catch (err) {
      console.error("Graduate error:", err);
      toast.error("Failed to graduate");
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (studentId: string, name: string) => {
    if (!confirm(`Revoke graduation for ${name}?`)) return;

    setBusyId(studentId);
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("tda_students")
        .update({
          graduation_status: "not_graduated",
          graduation_date: null,
          graduation_batch: null,
          graduation_notes: null,
          awards: [],
          updated_at: new Date().toISOString(),
        })
        .eq("id", studentId);

      if (error) {
        toast.error("Failed to revoke");
        setBusyId(null);
        return;
      }

      toast.success("🔄 Graduation revoked");
      loadStudents();
    } catch (err) {
      console.error("Revoke error:", err);
      toast.error("Failed to revoke");
    } finally {
      setBusyId(null);
    }
  };

  // Filter
  const filteredStudents = students.filter((s) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "graduated" && s.graduation_status === "graduated") ||
      (filter === "not_graduated" && s.graduation_status !== "graduated") ||
      (filter === "eligible" && s.graduation_status !== "graduated");

    const matchesSearch =
      !searchQuery ||
      s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.student_id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: students.length,
    graduated: students.filter((s) => s.graduation_status === "graduated").length,
    notGraduated: students.filter((s) => s.graduation_status !== "graduated").length,
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
          🎓 Graduation Management
        </h1>
        <p className="text-gray-600 text-sm">
          Review eligibility, approve graduation, and assign awards
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
            Approved Students
          </p>
          <p className="text-3xl font-bold text-brand-purple-900">
            {stats.total}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-green-200 shadow-md">
          <p className="text-xs text-green-600 uppercase font-semibold mb-1">
            Graduated
          </p>
          <p className="text-3xl font-bold text-green-600">{stats.graduated}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-yellow-200 shadow-md">
          <p className="text-xs text-yellow-600 uppercase font-semibold mb-1">
            In Progress
          </p>
          <p className="text-3xl font-bold text-yellow-600">
            {stats.notGraduated}
          </p>
        </div>
      </div>

      {/* Search */}
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
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { value: "all", label: "All Students" },
            { value: "not_graduated", label: "In Progress" },
            { value: "graduated", label: "Graduated" },
          ] as { value: FilterType; label: string }[]
        ).map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              filter === f.value
                ? "bg-brand-purple-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            No students found
          </h3>
          <p className="text-gray-500">Try a different filter or search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((student) => {
            const isGraduated = student.graduation_status === "graduated";
            const isBusy = busyId === student.id;

            return (
              <div
                key={student.id}
                className={`bg-white rounded-2xl p-5 border-2 shadow-md hover:shadow-lg transition-all ${
                  isGraduated
                    ? "border-green-200"
                    : "border-gray-100"
                }`}
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
                    <p className="text-xs text-gray-500">
                      {student.student_id} • Level {student.level} — {LEVEL_NAMES[student.level]}
                    </p>
                    <p className="text-xs text-gray-500">{student.batch}</p>
                  </div>

                  {isGraduated ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold border border-green-300">
                      🎓 Graduated
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-bold border border-yellow-300">
                      📚 In Progress
                    </span>
                  )}
                </div>

                {/* Awards (if graduated) */}
                {isGraduated && student.awards && student.awards.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {student.awards.map((award, i) => {
                      const awardInfo = AVAILABLE_AWARDS.find(
                        (a) => a.key === award
                      );
                      return (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-gold-100 border border-brand-gold-300 text-brand-purple-900 text-[10px] font-bold"
                        >
                          {awardInfo?.icon} {awardInfo?.label || award}
                        </span>
                      );
                    })}
                  </div>
                )}

                {isGraduated && student.graduation_date && (
                  <p className="text-xs text-green-600 mb-3">
                    Graduated on {formatDate(student.graduation_date)}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  {!isGraduated && (
                    <button
                      onClick={() => openGraduateModal(student)}
                      className="flex-1 px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 text-sm font-bold shadow-gold hover:shadow-gold-lg transition-all"
                    >
                      🎓 Graduate
                    </button>
                  )}
                  {isGraduated && (
                    <>
                      <button
                        onClick={() => openGraduateModal(student)}
                        className="flex-1 px-4 py-2 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-sm font-bold transition-all"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleRevoke(student.id, student.full_name)}
                        disabled={isBusy}
                        className="px-4 py-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700 text-sm font-bold transition-all disabled:opacity-50"
                      >
                        🔄 Revoke
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ━━━ GRADUATION MODAL ━━━ */}
      {graduatingStudent && (
        <>
          <div
            onClick={() => setGraduatingStudent(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {graduatingStudent.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={graduatingStudent.photo_url}
                        alt={graduatingStudent.full_name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-brand-gold-400"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-bold text-xl">
                        {graduatingStudent.full_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h2 className="font-heading text-xl font-bold text-brand-purple-900">
                        🎓 Graduate Student
                      </h2>
                      <p className="text-sm text-gray-500">
                        {graduatingStudent.full_name} — {graduatingStudent.student_id}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setGraduatingStudent(null)}
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

              <div className="p-6 space-y-5">
                {/* Batch */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Graduation Batch / Class
                  </label>
                  <input
                    type="text"
                    value={gradForm.graduation_batch}
                    onChange={(e) =>
                      setGradForm({ ...gradForm, graduation_batch: e.target.value })
                    }
                    placeholder="e.g. Class of 2026"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  />
                </div>

                {/* Graduation Date */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Graduation Date
                  </label>
                  <input
                    type="date"
                    value={gradForm.graduation_date}
                    onChange={(e) =>
                      setGradForm({ ...gradForm, graduation_date: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  />
                </div>

                {/* Awards */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    🏆 Awards (Optional)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AVAILABLE_AWARDS.map((award) => {
                      const isSelected = gradForm.awards.includes(award.key);

                      return (
                        <button
                          key={award.key}
                          type="button"
                          onClick={() => toggleAward(award.key)}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? "border-brand-gold-400 bg-brand-gold-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <span className="text-xl">{award.icon}</span>
                          <span
                            className={`text-sm font-bold ${
                              isSelected
                                ? "text-brand-purple-900"
                                : "text-gray-600"
                            }`}
                          >
                            {award.label}
                          </span>
                          {isSelected && (
                            <svg
                              className="w-5 h-5 text-brand-gold-500 ml-auto"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Graduation Notes
                  </label>
                  <textarea
                    value={gradForm.graduation_notes}
                    onChange={(e) =>
                      setGradForm({ ...gradForm, graduation_notes: e.target.value })
                    }
                    placeholder="Personal message or commendation for the student..."
                    rows={4}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setGraduatingStudent(null)}
                    className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGraduate}
                    disabled={isSubmitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "🎓 Confirm Graduation"}
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