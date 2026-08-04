// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN ASSIGNMENTS CLIENT – Create, view, grade + notify students
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";
import { notifyAllTDAStudents, notifyTDAStudent } from "@/lib/tda-notifications";

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

interface AssignmentWithSubmission extends Assignment {
  submissions?: Submission[];
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
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function TDAAdminAssignmentsClient() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);

  const [formData, setFormData] = useState({
    title: "", instructions: "", level: "", due_date: "",
  });

  const [gradeData, setGradeData] = useState({
    grade: "", score: "", feedback: "",
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const supabase = createClient();
      const [assignmentsRes, submissionsRes] = await Promise.all([
        supabase.from("tda_assignments").select("*").order("created_at", { ascending: false }),
        supabase.from("tda_submissions").select("*, student:tda_students(full_name, student_id, photo_url, email, level)").order("submitted_at", { ascending: false }),
      ]);
      setAssignments(assignmentsRes.data || []);
      setSubmissions((submissionsRes.data as Submission[]) || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ title: "", instructions: "", level: "", due_date: "" });
    setShowCreateForm(false);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error("Please enter a title"); return; }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tda_assignments").insert({
        title: formData.title.trim(),
        instructions: formData.instructions.trim() || null,
        level: formData.level || null,
        due_date: formData.due_date || null,
      });
      if (error) { toast.error(`Failed: ${error.message}`); setIsSubmitting(false); return; }

      // ✅ NOTIFY ALL STUDENTS
      await notifyAllTDAStudents({
        title: "📝 New Assignment Posted",
        message: `"${formData.title.trim()}" has been posted.${formData.due_date ? ` Due: ${formatShortDate(formData.due_date)}.` : ""} Check your assignments page.`,
        type: "assignment",
        link: "/bible-school/portal/assignments",
      });

      toast.success("✅ Assignment created and students notified!");
      resetForm();
      loadData();
    } catch { toast.error("Failed to create"); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?\n\nAll submissions will also be deleted.`)) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tda_assignments").delete().eq("id", id);
      if (error) { toast.error("Failed to delete"); setBusyId(null); return; }
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      setSubmissions((prev) => prev.filter((s) => s.assignment_id !== id));
      toast.success("🗑️ Deleted");
      setSelectedAssignment(null);
    } catch { toast.error("Delete failed"); }
    finally { setBusyId(null); }
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
      const { error } = await supabase.from("tda_submissions").update({
        grade: gradeData.grade.trim() || null,
        score: gradeData.score ? parseInt(gradeData.score) : null,
        feedback: gradeData.feedback.trim() || null,
        status: "graded",
        graded_at: new Date().toISOString(),
      }).eq("id", gradingSubmission.id);
      if (error) { toast.error("Failed to save grade"); setIsSubmitting(false); return; }

      // ✅ NOTIFY STUDENT
      if (gradingSubmission.student_id) {
        await notifyTDAStudent({
          studentId: gradingSubmission.student_id,
          title: "⭐ Your Assignment Has Been Graded!",
          message: `Your submission has been reviewed.${gradeData.grade ? ` Grade: ${gradeData.grade}.` : ""}${gradeData.score ? ` Score: ${gradeData.score}%.` : ""} Check your assignments for feedback.`,
          type: "graded",
          link: "/bible-school/portal/assignments",
        });
      }

      toast.success("✅ Graded and student notified!");
      setGradingSubmission(null);
      loadData();
    } catch { toast.error("Failed to save"); }
    finally { setIsSubmitting(false); }
  };

  const getSubmissionsForAssignment = (assignmentId: string) =>
    submissions.filter((s) => s.assignment_id === assignmentId);

  const stats = {
    totalAssignments: assignments.length,
    totalSubmissions: submissions.length,
    graded: submissions.filter((s) => s.status === "graded").length,
    pending: submissions.filter((s) => s.status === "submitted").length,
  };

  if (loading) return <LoadingScreen message="Loading assignments..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Page Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Assignments</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
            📝 Assignments
          </h1>
          <p className="text-brand-purple-200 text-sm mb-4">
            Create assignments and grade submissions. Students notified automatically.
          </p>
          <button onClick={() => setShowCreateForm(true)}
            className="w-full md:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all">
            ➕ Create Assignment
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Assignments", value: stats.totalAssignments, border: "border-brand-gold-400/40" },
          { label: "Submissions", value: stats.totalSubmissions, border: "border-blue-400/40" },
          { label: "To Grade", value: stats.pending, border: "border-brand-gold-400/40" },
          { label: "Graded", value: stats.graded, border: "border-green-400/40" },
        ].map((s) => (
          <div key={s.label} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${s.border} p-4 shadow-xl`}>
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">{s.label}</p>
            <p className="text-white font-black text-2xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Assignments List ── */}
      {assignments.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">📝</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">No assignments yet</h3>
          <p className="text-brand-purple-200 text-sm">Click &ldquo;Create Assignment&rdquo; to add your first one</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment) => {
            const subs = getSubmissionsForAssignment(assignment.id);
            const gradedCount = subs.filter((s) => s.status === "graded").length;
            const pendingCount = subs.length - gradedCount;
            const isBusy = busyId === assignment.id;
            const isPastDue = assignment.due_date && new Date(assignment.due_date) < new Date();

            return (
              <div key={assignment.id} className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {assignment.level ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black border border-blue-400/40">Level {assignment.level}</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-purple-950/60 text-white text-xs font-black border border-brand-gold-400/40">All Levels</span>
                  )}
                  {isPastDue && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-black border border-red-400/40">Past Due</span>
                  )}
                </div>

                <h3 className="font-heading font-black text-white text-base mb-1">{assignment.title}</h3>
                {assignment.instructions && (
                  <p className="text-brand-purple-200 text-sm line-clamp-2 mb-2">{assignment.instructions}</p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs text-brand-purple-200 mb-3">
                  {assignment.due_date && <span>📅 Due: {formatShortDate(assignment.due_date)}</span>}
                  <span>📋 {subs.length} submission(s)</span>
                  {gradedCount > 0 && <span className="text-green-300">✅ {gradedCount} graded</span>}
                  {pendingCount > 0 && <span className="text-white font-black">⏳ {pendingCount} to grade</span>}
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-brand-gold-400/30">
                  <button onClick={() => setSelectedAssignment(assignment)}
                    className="w-full py-2.5 rounded-xl bg-white text-brand-purple-900 text-xs font-black active:scale-95 transition-all">
                    📋 View Submissions ({subs.length})
                  </button>
                  <button onClick={() => handleDelete(assignment.id, assignment.title)} disabled={isBusy}
                    className="w-full py-2.5 rounded-xl bg-red-600 text-white text-xs font-black disabled:opacity-50 active:scale-95 transition-all">
                    🗑️ Delete Assignment
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CREATE FORM MODAL ── */}
      {showCreateForm && (
        <>
          <div onClick={resetForm} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-2xl pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">📝 Create Assignment</h2>
                  <button onClick={resetForm} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleCreate} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Assignment Title <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Write a 500-word essay on prayer" required
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Instructions</label>
                  <textarea value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    placeholder="Detailed instructions for the students..." rows={6}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">For Which Level</label>
                  <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white">
                    {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Due Date</label>
                  <input type="datetime-local" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button type="submit" disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                    {isSubmitting ? "Creating..." : "✅ Create & Notify Students"}
                  </button>
                  <button type="button" onClick={resetForm} className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* ── SUBMISSIONS VIEW MODAL ── */}
      {selectedAssignment && !gradingSubmission && (
        <>
          <div onClick={() => setSelectedAssignment(null)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-4xl pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Assignment Submissions</p>
                    <h2 className="font-heading text-lg font-bold text-brand-purple-900">{selectedAssignment.title}</h2>
                  </div>
                  <button onClick={() => setSelectedAssignment(null)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {selectedAssignment.instructions && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs font-bold text-brand-purple-900 uppercase tracking-widest mb-2">📖 The Question</p>
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{selectedAssignment.instructions}</p>
                  </div>
                )}
              </div>
              <div className="p-5">
                {(() => {
                  const subs = getSubmissionsForAssignment(selectedAssignment.id);
                  if (subs.length === 0) {
                    return <div className="text-center py-10"><p className="text-gray-500">No submissions yet</p></div>;
                  }
                  return (
                    <div className="space-y-3">
                      {subs.map((submission) => (
                        <div key={submission.id} className="p-4 rounded-xl border-2 border-gray-100 hover:border-brand-purple-300 transition-colors">
                          <div className="flex items-start gap-3">
                            {submission.student?.photo_url ? (
                              <img src={submission.student.photo_url} alt={submission.student.full_name} className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 flex-shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-brand-purple-100 flex items-center justify-center text-brand-purple-900 font-black flex-shrink-0">
                                {submission.student?.full_name.charAt(0)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <p className="font-black text-brand-purple-900 text-sm">{submission.student?.full_name}</p>
                                <span className="text-xs text-gray-500">{submission.student?.student_id}</span>
                                {submission.status === "graded" ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-black">✅ Graded {submission.grade && `(${submission.grade})`}</span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-black">⏳ Pending</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mb-2">Submitted {formatDate(submission.submitted_at)}</p>
                              {submission.submission_text && (
                                <div className="p-3 bg-gray-50 rounded-lg mb-2">
                                  <p className="text-sm text-gray-800 whitespace-pre-line line-clamp-3">{submission.submission_text}</p>
                                </div>
                              )}
                              {submission.file_url && (
                                <a href={submission.file_url} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-brand-purple-600 text-sm font-bold mb-2 hover:underline">
                                  📎 {submission.file_name || "View File"}
                                </a>
                              )}
                              <button onClick={() => openGrading(submission)}
                                className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 text-xs font-black shadow-gold active:scale-95 transition-all">
                                {submission.status === "graded" ? "✏️ Edit Grade" : "🎓 Grade Now"}
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

      {/* ── GRADING MODAL ── */}
      {gradingSubmission && (
        <>
          <div onClick={() => setGradingSubmission(null)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-2xl pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-lg font-bold text-brand-purple-900">🎓 Grade Submission</h2>
                    <p className="text-gray-500 text-sm mt-0.5">{gradingSubmission.student?.full_name} — {gradingSubmission.student?.student_id}</p>
                  </div>
                  <button onClick={() => setGradingSubmission(null)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleGrade} className="p-5 space-y-4">
                {selectedAssignment?.instructions && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs font-bold text-brand-purple-900 uppercase tracking-widest mb-2">📖 The Question</p>
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{selectedAssignment.instructions}</p>
                  </div>
                )}
                {gradingSubmission.submission_text && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs font-bold text-brand-purple-900 uppercase tracking-widest mb-2">✏️ Student&rsquo;s Answer</p>
                    <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-line">{gradingSubmission.submission_text}</p>
                  </div>
                )}
                {gradingSubmission.file_url && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs font-bold text-brand-purple-900 uppercase tracking-widest mb-2">📎 Attached File</p>
                    <a href={gradingSubmission.file_url} target="_blank" rel="noopener noreferrer" className="text-brand-purple-600 font-bold hover:underline text-sm">
                      {gradingSubmission.file_name || "View File"}
                    </a>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Grade (Letter)</label>
                  <input type="text" value={gradeData.grade} onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                    placeholder="e.g. A, B+, Pass"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Score (0-100)</label>
                  <input type="number" min="0" max="100" value={gradeData.score} onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
                    placeholder="e.g. 85"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Feedback for Student</label>
                  <textarea value={gradeData.feedback} onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                    placeholder="Encouraging feedback, corrections, or notes..." rows={5}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button type="submit" disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                    {isSubmitting ? "Saving..." : "💾 Save Grade & Notify Student"}
                  </button>
                  <button type="button" onClick={() => setGradingSubmission(null)} className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}