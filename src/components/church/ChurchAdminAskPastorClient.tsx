// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN ASK PASTOR – AI-assisted answers + notify members
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyMember } from "@/lib/notifications";
import LoadingScreen from "./LoadingScreen";

interface PastorQuestion {
  id: string;
  member_id: string | null;
  question: string;
  answer: string | null;
  ai_draft: string | null;
  status: string;
  answered_at: string | null;
  created_at: string;
  member?: { full_name: string } | null;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function timeAgo(d: string): string {
  const now = new Date();
  const then = new Date(d);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function ChurchAdminAskPastorClient() {
  const [questions, setQuestions] = useState<PastorQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQ, setSelectedQ] = useState<PastorQuestion | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => { loadQuestions(); }, []);

  const loadQuestions = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tfam_pastor_questions")
        .select("*, member:tfam_members(full_name)")
        .order("created_at", { ascending: false });
      setQuestions((data as PastorQuestion[]) || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const openQuestion = (q: PastorQuestion) => {
    setSelectedQ(q);
    setAnswerText(q.answer || q.ai_draft || "");
  };

  const generateAIDraft = async () => {
    if (!selectedQ) return;
    setIsGeneratingAI(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Member's question: "${selectedQ.question}"`,
          type: "ask-pastor",
        }),
      });
      const data = await res.json();
      if (data.error) { toast.error(data.error); return; }
      setAnswerText(data.result);
      const supabase = createClient();
      await supabase
        .from("tfam_pastor_questions")
        .update({ ai_draft: data.result })
        .eq("id", selectedQ.id);
      toast.success("🤖 AI draft generated! Review and edit before sending.");
    } catch { toast.error("AI generation failed"); }
    finally { setIsGeneratingAI(false); }
  };

  const sendAnswer = async () => {
    if (!selectedQ || !answerText.trim()) { toast.error("Write an answer first"); return; }
    setIsSending(true);
    try {
      const supabase = createClient();
      await supabase.from("tfam_pastor_questions").update({
        answer: answerText.trim(),
        status: "answered",
        answered_at: new Date().toISOString(),
      }).eq("id", selectedQ.id);

      if (selectedQ.member_id) {
        await notifyMember({
          memberId: selectedQ.member_id,
          title: "✅ Pastor Answered Your Question",
          message: `Your question has been answered: "${selectedQ.question.substring(0, 80)}${selectedQ.question.length > 80 ? "..." : ""}"`,
          type: "ask_pastor",
          link: "/member/ask-pastor",
        });
      }

      toast.success("✅ Answer sent to member!");
      setSelectedQ(null);
      setAnswerText("");
      loadQuestions();
    } catch { toast.error("Failed"); }
    finally { setIsSending(false); }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_pastor_questions").delete().eq("id", id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      if (selectedQ?.id === id) { setSelectedQ(null); setAnswerText(""); }
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const pendingCount = questions.filter((q) => q.status === "pending").length;
  const answeredCount = questions.filter((q) => q.status === "answered").length;

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading questions..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Ask The Pastor</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
            Member Questions
          </h1>
          <p className="text-brand-purple-100 text-sm">
            Answer member questions with AI assistance.
          </p>
          <div className="flex gap-4 pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{pendingCount}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{answeredCount}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Answered</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pending Alert ── */}
      {pendingCount > 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/60 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="flex items-center gap-4">
            <div className="text-3xl animate-pulse">❓</div>
            <div className="flex-1">
              <p className="font-black text-white text-base">
                {pendingCount} question{pendingCount > 1 ? "s" : ""} awaiting response!
              </p>
              <p className="text-brand-purple-200 text-sm">Use AI to draft answers quickly.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Empty State ── */}
      {questions.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-4xl mb-4">❓</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">No questions yet</h3>
          <p className="text-brand-purple-200 text-sm">Questions from members will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <div
              key={q.id}
              className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl cursor-pointer active:scale-95 transition-all"
              onClick={() => openQuestion(q)}
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black border ${
                      q.status === "pending"
                        ? "bg-brand-purple-950/60 text-white border-brand-gold-400/40"
                        : "bg-green-500/20 text-green-300 border-green-400/40"
                    }`}>
                      {q.status === "pending" ? "⏳ Pending" : "✅ Answered"}
                    </span>
                    {q.ai_draft && !q.answer && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/40">
                        🤖 AI Draft Ready
                      </span>
                    )}
                  </div>

                  {/* Member */}
                  {q.member && (
                    <p className="text-white font-black text-xs mb-1">
                      👤 {q.member.full_name}
                    </p>
                  )}

                  <p className="text-white font-bold text-sm">
                    &ldquo;{q.question}&rdquo;
                  </p>
                  <p className="text-brand-purple-200 font-semibold text-xs mt-2">
                    {timeAgo(q.created_at)}
                  </p>
                </div>

                {/* Delete — solid red */}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteQuestion(q.id); }}
                  className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 active:scale-95 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Answer Modal — KEEP bg-white — slides up mobile ── */}
      {selectedQ && (
        <>
          <div
            onClick={() => { setSelectedQ(null); setAnswerText(""); }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-2xl pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">
                    ❓ Answer Question
                  </h2>
                  <button
                    onClick={() => { setSelectedQ(null); setAnswerText(""); }}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Question Box — bg-white in modal is OK */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-2">
                    Member&apos;s Question
                  </p>
                  {selectedQ.member && (
                    <p className="text-brand-purple-900 font-black text-sm mb-2">
                      👤 {selectedQ.member.full_name}
                    </p>
                  )}
                  <p className="text-gray-900 font-semibold text-base">
                    &ldquo;{selectedQ.question}&rdquo;
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    📅 {formatDate(selectedQ.created_at)}
                  </p>
                </div>

                {/* AI Draft Button */}
                <button
                  onClick={generateAIDraft}
                  disabled={isGeneratingAI}
                  className="w-full py-4 rounded-xl bg-blue-600 text-white font-black active:scale-95 transition-all disabled:opacity-50"
                >
                  {isGeneratingAI ? "🤖 AI is drafting..." : "🤖 Generate AI Draft Answer"}
                </button>

                {/* Answer Text */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Answer
                  </label>
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    rows={8}
                    placeholder="Type your answer or use AI to generate a draft..."
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
                  />
                </div>

                {/* Action Buttons — full width stacked */}
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={sendAnswer}
                    disabled={isSending || !answerText.trim()}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSending ? "Sending..." : "✅ Send Answer to Member"}
                  </button>
                  <button
                    onClick={() => { setSelectedQ(null); setAnswerText(""); }}
                    className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold"
                  >
                    Cancel
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