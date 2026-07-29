// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN ASSIGNMENTS CLIENT — Create, view, grade assignments
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Assignment {
  id: string;
  title: string;
  instructions: string | null;
  level: string | null;
  due_date: string | null;
  created_at: string;
}

interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  submission_text: string | null;
  file_url: string | null;
  file_name: string | null;
  status: string;
  grade: string | null;
  score: number | null;
  feedback: string | null;
  submitted_at: string;
  graded_at: string | null;
  student?: {
    full_name: string;
    student_id: string;
    photo_url: string | null;
    email: string;
    level: string;
  };
}

const LEVELS = [
  { value: "", label: "All Levels" },
  { value: "100", label: "Level 100 only" },
  { value: "200", label: "Level 200 only" },
  { value: "300", label: "Level 300 only" },
  { value: "400", label: "Level 400 only" },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TDAAdminAssignmentsClient() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  // View modes
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(
    null
  );

  const [formData, setFormData] = useState({
    title: "",
    instructions: "",
    level: "",
    due_date: "",
  });

  const [gradeData, setGradeData] = useState({
    grade: "",
    score: "",
    feedback: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const supabase = createClient();

      const [assignmentsRes, submissionsRes] = await Promise.all([
        supabase
          .from("tda_assignments")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("tda_submissions")
          .select(
            "*, student:tda_students(full_name, student_id, photo_url, email, level)"
          )
          .order("submitted_at", { ascending: false }),
      ]);

      setAssignments(assignmentsRes.data || []);
      setSubmissions((submissionsRes.data as Submission[]) || []);
      setLoading(false);
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      instructions: "",
      level: "",
      due_date: "",
    });
    setShowCreateForm(false);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.from("tda_assignments").insert({
        title: formData.title.trim(),
        instructions: formData.instructions.trim() || null,
        level: formData.level || null,
        due_date: formData.due_date || null,
      });

      if (error) {
        toast.error(`Failed: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      toast.success("✅ Assignment created!");
      resetForm();
      loadData();
      setIsSubmitting(false);
    } catch (err) {
      console.error("Create error:", err);
      toast.error("Failed to create");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?\n\nAll submissions will also be deleted.`))
      return;

    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("tda_assignments")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("Failed to delete");
        setBusyId(null);
        return;
      }

      setAssignments((prev) => prev.filter((a) => a.id !== id));
      setSubmissions((prev) => prev.filter((s) => s.assignment_id !== id));
      toast.success("🗑️ Deleted");
      setSelectedAssignment(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const openGrading = (submission: Submission) => {
    setGradingSubmission(submission);
    setGradeData({
      grade: submission.grade || "",
      score: submission.score?.toString() || "",
      feedback: submission.feedback || "",
    });
  };

  const handleGrade = async (e: FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("tda_submissions")
        .update({
          grade: gradeData.grade.trim() || null,
          score: gradeData.score ? parseInt(gradeData.score) : null,
          feedback: gradeData.feedback.trim() || null,
          status: "graded",
          graded_at: new Date().toISOString(),
        })
        .eq("id", gradingSubmission.id);

      if (error) {
        toast.error("Failed to save grade");
        setIsSubmitting(false);
        return;
      }

      toast.success("✅ Graded successfully!");
      setGradingSubmission(null);
      loadData();
      setIsSubmitting(false);
    } catch (err) {
      console.error("Grade error:", err);
      toast.error("Failed to save");
      setIsSubmitting(false);
    }
  };

  const getSubmissionsForAssignment = (assignmentId: string) => {
    return submissions.filter((s) => s.assignment_id === assignmentId);
  };

  const stats = {
    totalAssignments: assignments.length,
    totalSubmissions: submissions.length,
    graded: submissions.filter((s) => s.status === "graded").length,
    pending: submissions.filter((s) => s.status === "submitted").length,
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
            📝 Assignments
          </h1>
          <p className="text-gray-600 text-sm">
            Create assignments and grade student submissions
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Create Assignment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
            Assignments
          </p>
          <p className="text-3xl font-bold text-brand-purple-900">
            {stats.totalAssignments}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-blue-200 shadow-md">
          <p className="text-xs text-blue-600 uppercase font-semibold mb-1">
            Total Submissions
          </p>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalSubmissions}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-yellow-200 shadow-md">
          <p className="text-xs text-yellow-600 uppercase font-semibold mb-1">
            To Grade
          </p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-green-200 shadow-md">
          <p className="text-xs text-green-600 uppercase font-semibold mb-1">
            Graded
          </p>
          <p className="text-3xl font-bold text-green-600">{stats.graded}</p>
        </div>
      </div>

      {/* Assignments List */}
      {assignments.length === 0 ? (
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
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
              />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            No assignments yet
          </h3>
          <p className="text-gray-500">
            Click &ldquo;Create Assignment&rdquo; to add your first one
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const subs = getSubmissionsForAssignment(assignment.id);
            const gradedCount = subs.filter((s) => s.status === "graded").length;
            const pendingCount = subs.length - gradedCount;
            const isBusy = busyId === assignment.id;
            const isPastDue =
              assignment.due_date && new Date(assignment.due_date) < new Date();

            return (
              <div
                key={assignment.id}
                className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {assignment.level && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                          Level {assignment.level}
                        </span>
                      )}
                      {!assignment.level && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                          All Levels
                        </span>
                      )}
                      {isPastDue && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                          Past Due
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-bold text-brand-purple-900 text-lg mb-1">
                      {assignment.title}
                    </h3>

                    {assignment.instructions && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                        {assignment.instructions}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {assignment.due_date && (
                        <span>📅 Due: {formatShortDate(assignment.due_date)}</span>
                      )}
                      <span>
                        📝 {subs.length} submission(s)
                      </span>
                      {gradedCount > 0 && (
                        <span className="text-green-600">
                          ✅ {gradedCount} graded
                        </span>
                      )}
                      {pendingCount > 0 && (
                        <span className="text-yellow-600 font-bold">
                          ⏳ {pendingCount} to grade
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedAssignment(assignment)}
                    className="flex-1 px-4 py-2 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-sm font-bold transition-all"
                  >
                    📋 View Submissions ({subs.length})
                  </button>
                  <button
                    onClick={() => handleDelete(assignment.id, assignment.title)}
                    disabled={isBusy}
                    className="px-4 py-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700 text-sm font-bold transition-all disabled:opacity-50"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ━━━ CREATE ASSIGNMENT MODAL ━━━ */}
      {showCreateForm && (
        <>
          <div
            onClick={resetForm}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-brand-purple-900">
                      📝 Create Assignment
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Set a task for your students
                    </p>
                  </div>
                  <button
                    onClick={resetForm}
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

              <form onSubmit={handleCreate} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Assignment Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Write a 500-word essay on prayer"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Instructions
                  </label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) =>
                      setFormData({ ...formData, instructions: e.target.value })
                    }
                    placeholder="Detailed instructions for the students..."
                    rows={6}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      For Which Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
                    >
                      {LEVELS.map((l) => (
                        <option key={l.value} value={l.value}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.due_date}
                      onChange={(e) =>
                        setFormData({ ...formData, due_date: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Creating..." : "✅ Create Assignment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* ━━━ SUBMISSIONS VIEW MODAL ━━━ */}
      {selectedAssignment && !gradingSubmission && (
        <>
          <div
            onClick={() => setSelectedAssignment(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">
                      Assignment Submissions
                    </p>
                    <h2 className="font-heading text-xl font-bold text-brand-purple-900">
                      {selectedAssignment.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedAssignment(null)}
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

                {/* Question Preview */}
                {selectedAssignment.instructions && (
                  <div className="mt-4 p-4 bg-brand-purple-50 rounded-xl border-2 border-brand-purple-100">
                    <p className="text-xs font-bold text-brand-purple-900 uppercase tracking-widest mb-2">
                      📖 The Question
                    </p>
                    <p className="text-brand-purple-800 text-sm leading-relaxed whitespace-pre-line">
                      {selectedAssignment.instructions}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6">
                {(() => {
                  const subs = getSubmissionsForAssignment(selectedAssignment.id);

                  if (subs.length === 0) {
                    return (
                      <div className="text-center py-10">
                        <p className="text-gray-500">No submissions yet</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {subs.map((submission) => (
                        <div
                          key={submission.id}
                          className="p-4 rounded-xl border-2 border-gray-100 hover:border-brand-purple-300 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            {submission.student?.photo_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={submission.student.photo_url}
                                alt={submission.student.full_name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-brand-gold-400"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-bold">
                                {submission.student?.full_name.charAt(0)}
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <p className="font-bold text-brand-purple-900">
                                  {submission.student?.full_name}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {submission.student?.student_id}
                                </span>
                                {submission.status === "graded" ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                    ✅ Graded {submission.grade && `(${submission.grade})`}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                                    ⏳ Pending
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-gray-500 mb-2">
                                Submitted {formatDate(submission.submitted_at)}
                              </p>

                              {submission.submission_text && (
                                <div className="p-3 bg-gray-50 rounded-lg mb-2">
                                  <p className="text-sm text-gray-800 whitespace-pre-line line-clamp-3">
                                    {submission.submission_text}
                                  </p>
                                </div>
                              )}

                              {submission.file_url && (
                                <a
                                  href={submission.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-brand-purple-600 hover:text-brand-purple-700 text-sm font-bold mb-2"
                                >
                                  📎 {submission.file_name || "View File"}
                                </a>
                              )}

                              <button
                                onClick={() => openGrading(submission)}
                                className="mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 text-sm font-bold shadow-gold hover:shadow-gold-lg transition-all"
                              >
                                {submission.status === "graded"
                                  ? "✏️ Edit Grade"
                                  : "🎓 Grade Now"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ━━━ GRADING MODAL ━━━ */}
      {gradingSubmission && (
        <>
          <div
            onClick={() => setGradingSubmission(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-brand-purple-900">
                      🎓 Grade Submission
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {gradingSubmission.student?.full_name} — {gradingSubmission.student?.student_id}
                    </p>
                  </div>
                  <button
                    onClick={() => setGradingSubmission(null)}
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

              <form onSubmit={handleGrade} className="p-6 space-y-5">
                {/* Question */}
                {selectedAssignment?.instructions && (
                  <div className="p-4 bg-brand-purple-50 rounded-xl border-2 border-brand-purple-100">
                    <p className="text-xs font-bold text-brand-purple-900 uppercase tracking-widest mb-2">
                      📖 The Question
                    </p>
                    <p className="text-brand-purple-800 text-sm leading-relaxed whitespace-pre-line">
                      {selectedAssignment.instructions}
                    </p>
                  </div>
                )}

                {/* Student's Answer */}
                {gradingSubmission.submission_text && (
                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                      ✍️ Student&rsquo;s Answer
                    </p>
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                      {gradingSubmission.submission_text}
                    </p>
                  </div>
                )}

                {/* File */}
                {gradingSubmission.file_url && (
                  <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">
                      📎 Attached File
                    </p>
                    <a
                      href={gradingSubmission.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-bold hover:underline"
                    >
                      {gradingSubmission.file_name || "View File"}
                    </a>
                  </div>
                )}

                {/* Grade + Score */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Grade (Letter)
                    </label>
                    <input
                      type="text"
                      value={gradeData.grade}
                      onChange={(e) =>
                        setGradeData({ ...gradeData, grade: e.target.value })
                      }
                      placeholder="e.g. A, B+, Pass"
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Score (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={gradeData.score}
                      onChange={(e) =>
                        setGradeData({ ...gradeData, score: e.target.value })
                      }
                      placeholder="e.g. 85"
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                    />
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Feedback for Student
                  </label>
                  <textarea
                    value={gradeData.feedback}
                    onChange={(e) =>
                      setGradeData({ ...gradeData, feedback: e.target.value })
                    }
                    placeholder="Encouraging feedback, corrections, or notes..."
                    rows={5}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setGradingSubmission(null)}
                    className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "💾 Save Grade"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}