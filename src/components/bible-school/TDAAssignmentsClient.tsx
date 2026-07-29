// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ASSIGNMENTS CLIENT — View assignments, submit, see grades
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
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
}

interface AssignmentWithSubmission extends Assignment {
  submission?: Submission;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Check if past due
function isPastDue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

// Get status display
function getStatusDisplay(assignment: AssignmentWithSubmission): {
  label: string;
  color: string;
  icon: string;
} {
  if (assignment.submission?.status === "graded") {
    return {
      label: "Graded",
      color: "bg-green-100 text-green-700 border-green-300",
      icon: "✅",
    };
  }
  if (assignment.submission) {
    return {
      label: "Submitted",
      color: "bg-blue-100 text-blue-700 border-blue-300",
      icon: "📝",
    };
  }
  if (isPastDue(assignment.due_date)) {
    return {
      label: "Overdue",
      color: "bg-red-100 text-red-700 border-red-300",
      icon: "⚠️",
    };
  }
  return {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    icon: "⏳",
  };
}

export default function TDAAssignmentsClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [assignments, setAssignments] = useState<AssignmentWithSubmission[]>(
    []
  );
  const [studentId, setStudentId] = useState<string>("");
  const [studentLevel, setStudentLevel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignmentWithSubmission | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "submitted" | "graded">(
    "all"
  );

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const session = localStorage.getItem("tda_student_session");
      if (!session) return;

      const sessionData = JSON.parse(session);
      setStudentId(sessionData.id);
      setStudentLevel(sessionData.level);

      const supabase = createClient();

      // Fetch assignments for student's level OR all levels
      const { data: assignmentsData } = await supabase
        .from("tda_assignments")
        .select("*")
        .or(`level.eq.${sessionData.level},level.is.null`)
        .order("due_date", { ascending: true });

      // Fetch student's submissions
      const { data: submissionsData } = await supabase
        .from("tda_submissions")
        .select("*")
        .eq("student_id", sessionData.id);

      // Combine
      const combined: AssignmentWithSubmission[] = (assignmentsData || []).map(
        (a) => ({
          ...a,
          submission: submissionsData?.find((s) => s.assignment_id === a.id),
        })
      );

      setAssignments(combined);
      setLoading(false);
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large! Max 10 MB");
      return;
    }

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
      toast.error("Please provide either a text answer or upload a file");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      let fileUrl = selectedAssignment.submission?.file_url || null;
      let fileName = selectedAssignment.submission?.file_name || null;

      // Upload file if new one selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const uploadName = `submission-${studentId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("tda-files")
          .upload(`submissions/${uploadName}`, selectedFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error(`Upload failed: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("tda-files")
          .getPublicUrl(`submissions/${uploadName}`);

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
        // Update existing
        const result = await supabase
          .from("tda_submissions")
          .update(payload)
          .eq("id", selectedAssignment.submission.id);
        error = result.error;
      } else {
        // Create new
        const result = await supabase
          .from("tda_submissions")
          .insert(payload);
        error = result.error;
      }

      if (error) {
        console.error("Submit error:", error);
        toast.error(`Submission failed: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      toast.success("✅ Assignment submitted!");
      setSelectedAssignment(null);
      setSubmissionText("");
      setSelectedFile(null);
      loadAssignments();
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter assignments
  const filteredAssignments = assignments.filter((a) => {
    if (filter === "all") return true;
    if (filter === "pending") return !a.submission;
    if (filter === "submitted") return a.submission?.status === "submitted";
    if (filter === "graded") return a.submission?.status === "graded";
    return true;
  });

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
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
          📝 Assignments
        </h1>
        <p className="text-gray-600 text-sm">
          Submit your assignments and view grades for Level {studentLevel}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
            Total
          </p>
          <p className="text-2xl font-bold text-brand-purple-900">
            {assignments.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-yellow-200 shadow-md">
          <p className="text-xs text-yellow-600 uppercase font-semibold mb-1">
            Pending
          </p>
          <p className="text-2xl font-bold text-yellow-600">
            {assignments.filter((a) => !a.submission).length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-blue-200 shadow-md">
          <p className="text-xs text-blue-600 uppercase font-semibold mb-1">
            Submitted
          </p>
          <p className="text-2xl font-bold text-blue-600">
            {assignments.filter((a) => a.submission?.status === "submitted").length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-green-200 shadow-md">
          <p className="text-xs text-green-600 uppercase font-semibold mb-1">
            Graded
          </p>
          <p className="text-2xl font-bold text-green-600">
            {assignments.filter((a) => a.submission?.status === "graded").length}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "submitted", "graded"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all capitalize ${
              filter === f
                ? "bg-brand-purple-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
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
            {filter === "all"
              ? "No assignments yet"
              : `No ${filter} assignments`}
          </h3>
          <p className="text-gray-500">
            {filter === "all"
              ? "Assignments will appear here once created by your instructor"
              : `You have no ${filter} assignments at the moment`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
            const status = getStatusDisplay(assignment);
            const overdue = isPastDue(assignment.due_date) && !assignment.submission;

            return (
              <div
                key={assignment.id}
                className={`bg-white rounded-2xl p-5 border-2 shadow-md hover:shadow-lg transition-all ${
                  overdue
                    ? "border-red-200"
                    : "border-gray-100 hover:border-brand-purple-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${status.color}`}
                      >
                        {status.icon} {status.label}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-brand-purple-900 text-lg mb-1">
                      {assignment.title}
                    </h3>
                    {assignment.instructions && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                        {assignment.instructions}
                      </p>
                    )}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
                  {assignment.due_date && (
                    <span
                      className={
                        overdue
                          ? "text-red-600 font-bold"
                          : "text-gray-500"
                      }
                    >
                      📅 Due: {formatDate(assignment.due_date)}
                    </span>
                  )}
                  {assignment.submission && (
                    <span>
                      ✅ Submitted: {formatDate(assignment.submission.submitted_at)}
                    </span>
                  )}
                </div>

                {/* Grade & Feedback (if graded) */}
                {assignment.submission?.status === "graded" && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-green-700 uppercase tracking-widest">
                        🎓 Grade
                      </p>
                      <div className="flex items-center gap-2">
                        {assignment.submission.grade && (
                          <span className="text-2xl font-bold text-green-700">
                            {assignment.submission.grade}
                          </span>
                        )}
                        {assignment.submission.score !== null && (
                          <span className="text-lg font-bold text-green-700">
                            ({assignment.submission.score}%)
                          </span>
                        )}
                      </div>
                    </div>
                    {assignment.submission.feedback && (
                      <div>
                        <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">
                          📝 Feedback
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {assignment.submission.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => openAssignment(assignment)}
                  disabled={assignment.submission?.status === "graded"}
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                    assignment.submission?.status === "graded"
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold hover:shadow-gold-lg hover:scale-105"
                  }`}
                >
                  {assignment.submission?.status === "graded"
                    ? "✅ Graded"
                    : assignment.submission
                    ? "✏️ Update Submission"
                    : "📝 Submit Assignment"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ━━━ SUBMISSION MODAL ━━━ */}
      {selectedAssignment && (
        <>
          <div
            onClick={() => setSelectedAssignment(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="font-heading text-xl font-bold text-brand-purple-900">
                      📝 {selectedAssignment.title}
                    </h2>
                    {selectedAssignment.due_date && (
                      <p className="text-sm text-gray-500 mt-1">
                        Due: {formatDate(selectedAssignment.due_date)}
                      </p>
                    )}
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
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Instructions */}
                {selectedAssignment.instructions && (
                  <div className="bg-brand-purple-50 rounded-2xl p-4 border-2 border-brand-purple-100">
                    <p className="text-xs font-bold text-brand-purple-900 uppercase tracking-widest mb-2">
                      📖 Instructions
                    </p>
                    <p className="text-brand-purple-900 leading-relaxed whitespace-pre-line">
                      {selectedAssignment.instructions}
                    </p>
                  </div>
                )}

                {/* Text Answer */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    ✍️ Your Answer
                  </label>
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📎 Attach File (Optional)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="assignment-file"
                  />
                  <label
                    htmlFor="assignment-file"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 font-bold cursor-pointer transition-all"
                  >
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
                        d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                      />
                    </svg>
                    {selectedFile ? "Change File" : "Choose File"}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    📎 PDF, Word, Image • Max 10 MB
                  </p>

                  {selectedFile && (
                    <div className="mt-3 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                      <p className="text-sm text-green-700 font-semibold">
                        ✅ {selectedFile.name}
                      </p>
                    </div>
                  )}

                  {selectedAssignment.submission?.file_name && !selectedFile && (
                    <div className="mt-3 p-3 bg-blue-50 border-2 border-blue-200 rounded-xl">
                      <p className="text-sm text-blue-700 font-semibold">
                        📎 Previously uploaded: {selectedAssignment.submission.file_name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setSelectedAssignment(null)}
                    className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="w-5 h-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        {selectedAssignment.submission
                          ? "💾 Update Submission"
                          : "📤 Submit Assignment"}
                      </>
                    )}
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