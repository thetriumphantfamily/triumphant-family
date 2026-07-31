// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN ASK PASTOR CLIENT — AI-assisted Q&A management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

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
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
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
      const { data } = await supabase.from("tfam_pastor_questions").select("*, member:tfam_members(full_name)").order("created_at", { ascending: false });
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
        body: JSON.stringify({ prompt: `Member's question: "${selectedQ.question}"`, type: "ask-pastor" }),
      });
      const data = await res.json();
      if (data.error) { toast.error(data.error); return; }
      setAnswerText(data.result);
      // Save AI draft to database
      const supabase = createClient();
      await supabase.from("tfam_pastor_questions").update({ ai_draft: data.result }).eq("id", selectedQ.id);
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

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">Ask The Pastor</span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            Member{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">Questions</span>
          </h1>
          <p className="text-brand-purple-100 text-sm md:text-base">Answer member questions with AI assistance</p>
          <div className="flex gap-4 pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className={`font-black text-2xl ${pendingCount > 0 ? "text-amber-400" : "text-white"}`}>{pendingCount}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{answeredCount}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Answered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Alert */}
      {pendingCount > 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-700 via-amber-600 to-amber-700 border-2 border-amber-400/60 p-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="text-3xl animate-pulse">❓</div>
            <div className="flex-1">
              <p className="font-black text-white text-lg">{pendingCount} question{pendingCount > 1 ? "s" : ""} awaiting response!</p>
              <p className="text-white/80 font-semibold text-sm">Use AI to draft answers quickly</p>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">❓</div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">No questions yet</h3>
          <p className="text-gray-500">Questions from members will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <div key={q.id} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${q.status === "pending" ? "border-amber-400/60" : "border-brand-gold-400/40"} p-5 shadow-xl cursor-pointer hover:border-brand-gold-400 transition-all`}
              onClick={() => openQuestion(q)}>
              <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${q.status === "pending" ? "from-amber-400 via-amber-500 to-amber-400" : "from-brand-gold-300 via-brand-gold-400 to-brand-gold-500"}`} />
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black border ${q.status === "pending" ? "bg-amber-500/20 text-amber-300 border-amber-400/40" : "bg-green-500/20 text-green-300 border-green-400/40"}`}>
                      {q.status === "pending" ? "⏳ Pending" : "✅ Answered"}
                    </span>
                    {q.ai_draft && !q.answer && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/40">🤖 AI Draft Ready</span>}
                  </div>
                  {q.member && <p className="text-brand-gold-300 font-black text-xs mb-1">👤 {q.member.full_name}</p>}
                  <p className="text-white font-bold text-sm">&ldquo;{q.question}&rdquo;</p>
                  <p className="text-brand-purple-300 font-semibold text-xs mt-2">{timeAgo(q.created_at)}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteQuestion(q.id); }}
                  className="w-9 h-9 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/40 flex items-center justify-center transition-colors flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Answer Modal */}
      {selectedQ && (
        <>
          <div onClick={() => { setSelectedQ(null); setAnswerText(""); }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold text-brand-purple-900">❓ Answer Question</h2>
                  <button onClick={() => { setSelectedQ(null); setAnswerText(""); }} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {/* Question */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="font-bold text-gray-500 text-xs uppercase tracking-widest mb-2">Member&apos;s Question</p>
                  {selectedQ.member && <p className="text-brand-purple-900 font-bold text-sm mb-1">👤 {selectedQ.member.full_name}</p>}
                  <p className="text-gray-800 font-semibold text-base">&ldquo;{selectedQ.question}&rdquo;</p>
                  <p className="text-gray-500 text-xs mt-2">📅 {formatDate(selectedQ.created_at)}</p>
                </div>

                {/* AI Button */}
                <button onClick={generateAIDraft} disabled={isGeneratingAI}
                  className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-black shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100">
                  {isGeneratingAI ? "🤖 AI is drafting..." : "🤖 Generate AI Draft Answer"}
                </button>

                {/* Answer */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Answer</label>
                  <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)}
                    rows={8} placeholder="Type your answer or use AI to generate a draft..."
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button onClick={() => { setSelectedQ(null); setAnswerText(""); }}
                    className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold">Cancel</button>
                  <button onClick={sendAnswer} disabled={isSending || !answerText.trim()}
                    className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all disabled:opacity-50">
                    {isSending ? "Sending..." : "✅ Send Answer to Member"}
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