// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ASSIGNMENTS CLIENT – View assignments, submit, see grades
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

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
}

interface AssignmentWithSubmission extends Assignment {
  submission?: Submission;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function isPastDue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

function getStatusBadge(assignment: AssignmentWithSubmission): {
  label: string;
  className: string;
} {
  if (assignment.submission?.status === "graded") {
    return { label: "✅ Graded", className: "bg-green-500/20 text-green-300 border-green-400/40" };
  }
  if (assignment.submission) {
    return { label: "📤 Submitted", className: "bg-blue-500/20 text-blue-300 border-blue-400/40" };
  }
  if (isPastDue(assignment.due_date)) {
    return { label: "⚠️ Overdue", className: "bg-red-500/20 text-red-300 border-red-400/40" };
  }
  return { label: "⏳ Pending", className: "bg-brand-purple-950/60 text-white border-brand-gold-400/40" };
}

export default function TDAAssignmentsClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [assignments, setAssignments] = useState<AssignmentWithSubmission[]>([]);
  const [studentId, setStudentId] = useState<string>("");
  const [studentLevel, setStudentLevel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentWithSubmission | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "submitted" | "graded">("all");

  useEffect(() => { loadAssignments(); }, []);

  const loadAssignments = async () => {
    try {
      const session = localStorage.getItem("tda_student_session");
      if (!session) return;
      const sessionData = JSON.parse(session);
      setStudentId(sessionData.id);
      setStudentLevel(sessionData.level);
      const supabase = createClient();
      const { data: assignmentsData } = await supabase
        .from("tda_assignments").select("*")
        .or(`level.eq.${sessionData.level},level.is.null`)
        .order("due_date", { ascending: true });
      const { data: submissionsData } = await supabase
        .from("tda_submissions").select("*").eq("student_id", sessionData.id);
      const combined: AssignmentWithSubmission[] = (assignmentsData || []).map((a) => ({
        ...a,
        submission: submissionsData?.find((s) => s.assignment_id === a.id),
      }));
      setAssignments(combined);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) { toast.error("File too large! Max 10 MB"); return; }
    setSelectedFile(file);
  };

  const openAssignment = (assignment: AssignmentWithSubmission) => {
    setSelectedAssignment(assignment);
    setSubmissionText(assignment.submission?.submission_text || "");
    setSelectedFile(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    if (!submissionText.trim() && !selectedFile) {
      toast.error("Please provide either a text answer or upload a file"); return;
    }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      let fileUrl = selectedAssignment.submission?.file_url || null;
      let fileName = selectedAssignment.submission?.file_name || null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const uploadName = `submission-${studentId}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("tda-files").upload(`submissions/${uploadName}`, selectedFile);
        if (uploadError) { toast.error(`Upload failed: ${uploadError.message}`); setIsSubmitting(false); return; }
        const { data: { publicUrl } } = supabase.storage.from("tda-files").getPublicUrl(`submissions/${uploadName}`);
        fileUrl = publicUrl;
        fileName = selectedFile.name;
      }

      const payload = {
        assignment_id: selectedAssignment.id,
        student_id: studentId,
        submission_text: submissionText.trim() || null,
        file_url: fileUrl,
        file_name: fileName,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      };

      let error;
      if (selectedAssignment.submission) {
        const result = await supabase.from("tda_submissions").update(payload).eq("id", selectedAssignment.submission.id);
        error = result.error;
      } else {
        const result = await supabase.from("tda_submissions").insert(payload);
        error = result.error;
      }

      if (error) { toast.error(`Submission failed: ${error.message}`); setIsSubmitting(false); return; }

      toast.success("✅ Assignment submitted!");
      setSelectedAssignment(null);
      setSubmissionText("");
      setSelectedFile(null);
      loadAssignments();
    } catch (err) { console.error(err); toast.error("Submission failed"); }
    finally { setIsSubmitting(false); }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filter === "all") return true;
    if (filter === "pending") return !a.submission;
    if (filter === "submitted") return a.submission?.status === "submitted";
    if (filter === "graded") return a.submission?.status === "graded";
    return true;
  });

  // ✅ LOADING SCREEN
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
          <p className="text-brand-purple-200 text-sm">
            Submit your assignments and view grades for Level {studentLevel}.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 mt-4 border-t border-brand-gold-400/30">
            {[
              { label: "Total", value: assignments.length, border: "border-brand-gold-400/40" },
              { label: "Pending", value: assignments.filter((a) => !a.submission).length, border: "border-brand-gold-400/40" },
              { label: "Submitted", value: assignments.filter((a) => a.submission?.status === "submitted").length, border: "border-blue-400/40" },
              { label: "Graded", value: assignments.filter((a) => a.submission?.status === "graded").length, border: "border-green-400/40" },
            ].map((s) => (
              <div key={s.label} className={`relative rounded-2xl overflow-hidden bg-brand-purple-950/60 border ${s.border} p-3 text-center`}>
                <p className="text-white font-black text-2xl">{s.value}</p>
                <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "submitted", "graded"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-black transition-all capitalize ${
              filter === f
                ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                : "bg-white text-brand-purple-900"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Assignments List ── */}
      {filteredAssignments.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">📝</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">
            {filter === "all" ? "No assignments yet" : `No ${filter} assignments`}
          </h3>
          <p className="text-brand-purple-200 text-sm">
            {filter === "all"
              ? "Assignments will appear here once created by your instructor"
              : `You have no ${filter} assignments at the moment`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAssignments.map((assignment) => {
            const status = getStatusBadge(assignment);
            const overdue = isPastDue(assignment.due_date) && !assignment.submission;
            return (
              <div
                key={assignment.id}
                className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                  overdue ? "border-red-400/60" : "border-brand-gold-400/40"
                } p-5 shadow-xl`}
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <h3 className="font-heading font-black text-white text-base mb-1">
                  {assignment.title}
                </h3>

                {assignment.instructions && (
                  <p className="text-brand-purple-200 text-sm line-clamp-2 mb-2">
                    {assignment.instructions}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 text-xs text-brand-purple-200 mb-3">
                  {assignment.due_date && (
                    <span className={overdue ? "text-red-300 font-black" : ""}>
                      📅 Due: {formatDate(assignment.due_date)}
                    </span>
                  )}
                  {assignment.submission && (
                    <span>✅ Submitted: {formatDate(assignment.submission.submitted_at)}</span>
                  )}
                </div>

                {/* Grade Box */}
                {assignment.submission?.status === "graded" && (
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-green-400/40 p-4 mb-3">
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-green-400 via-green-500 to-green-400" />
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white/80 text-xs font-black uppercase tracking-widest">🎓 Grade</p>
                      <div className="flex items-center gap-2">
                        {assignment.submission.grade && (
                          <span className="text-2xl font-black text-white">{assignment.submission.grade}</span>
                        )}
                        {assignment.submission.score !== null && (
                          <span className="text-lg font-black text-green-300">({assignment.submission.score}%)</span>
                        )}
                      </div>
                    </div>
                    {assignment.submission.feedback && (
                      <div>
                        <p className="text-white/80 text-xs font-black uppercase tracking-widest mb-1">📝 Feedback</p>
                        <p className="text-white font-semibold text-sm leading-relaxed">{assignment.submission.feedback}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => openAssignment(assignment)}
                  disabled={assignment.submission?.status === "graded"}
                  className={`w-full py-3 rounded-xl font-black transition-all ${
                    assignment.submission?.status === "graded"
                      ? "bg-brand-purple-950/60 text-white/50 border border-brand-gold-400/20 cursor-not-allowed"
                      : "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold active:scale-95"
                  }`}
                >
                  {assignment.submission?.status === "graded"
                    ? "✅ Graded"
                    : assignment.submission
                    ? "✏️ Update Submission"
                    : "📤 Submit Assignment"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Submission Modal — KEEP bg-white — slides up mobile ── */}
      {selectedAssignment && (
        <>
          <div onClick={() => setSelectedAssignment(null)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-2xl pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="font-heading text-lg font-bold text-brand-purple-900">
                      📝 {selectedAssignment.title}
                    </h2>
                    {selectedAssignment.due_date && (
                      <p className="text-sm text-gray-500 mt-1">
                        Due: {formatDate(selectedAssignment.due_date)}
                      </p>
                    )}
                  </div>
                  <button onClick={() => setSelectedAssignment(null)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Instructions */}
                {selectedAssignment.instructions && (
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <p className="text-xs font-bold text-brand-purple-900 uppercase tracking-widest mb-2">📖 Instructions</p>
                    <p className="text-gray-800 leading-relaxed whitespace-pre-line text-sm">
                      {selectedAssignment.instructions}
                    </p>
                  </div>
                )}

                {/* Text Answer */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">✏️ Your Answer</label>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={6}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">📎 Attach File (Optional)</label>
                  <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" id="assignment-file" />
                  <label
                    htmlFor="assignment-file"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-purple-900 text-white font-black cursor-pointer transition-all active:scale-95"
                  >
                    📎 {selectedFile ? "Change File" : "Choose File"}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PDF, Word, Image • Max 10 MB</p>

                  {selectedFile && (
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <p className="text-sm text-gray-800 font-semibold">✅ {selectedFile.name}</p>
                    </div>
                  )}
                  {selectedAssignment.submission?.file_name && !selectedFile && (
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <p className="text-sm text-gray-800 font-semibold">📎 Previously: {selectedAssignment.submission.file_name}</p>
                    </div>
                  )}
                </div>

                {/* Actions — full width stacked */}
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : selectedAssignment.submission ? "💾 Update Submission" : "📤 Submit Assignment"}
                  </button>
                  <button type="button" onClick={() => setSelectedAssignment(null)} className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold">
                    Cancel
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