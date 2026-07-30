// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER ASK PASTOR CLIENT — Submit questions privately
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Question { id: string; question: string; answer: string | null; status: string; created_at: string; answered_at: string | null; }

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function MemberAskPastorClient() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  useEffect(() => { loadQuestions(); }, []);

  const loadQuestions = async () => {
    try {
      const session = localStorage.getItem("tfam_member_session");
      if (!session) return;
      const sessionData = JSON.parse(session);
      const supabase = createClient();
      const { data } = await supabase.from("tfam_pastor_questions").select("*").eq("member_id", sessionData.id).order("created_at", { ascending: false });
      setQuestions(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) { toast.error("Please type your question"); return; }
    setIsSubmitting(true);
    try {
      const session = localStorage.getItem("tfam_member_session");
      if (!session) return;
      const sessionData = JSON.parse(session);
      const supabase = createClient();
      const { error } = await supabase.from("tfam_pastor_questions").insert({ member_id: sessionData.id, question: newQuestion.trim() });
      if (error) { toast.error(error.message); setIsSubmitting(false); return; }
      toast.success("📩 Question submitted! Pastor will respond soon.");
      setNewQuestion("");
      setShowForm(false);
      loadQuestions();
    } catch (err) { console.error(err); toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">❓ Ask the Pastor</h1>
          <p className="text-gray-600 text-sm">Submit questions privately and get pastoral guidance</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all">
          ✏️ Ask a Question
        </button>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">❓</div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">No questions yet</h3>
          <p className="text-gray-500">Ask the Pastor anything about faith, life, or ministry</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                {q.status === "answered" ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-300">✅ Answered</span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-300">⏳ Pending</span>
                )}
                <span className="text-xs text-gray-500">{formatDate(q.created_at)}</span>
              </div>

              <div className="bg-brand-purple-50 rounded-xl p-4 border-2 border-brand-purple-100 mb-3">
                <p className="text-xs font-bold text-brand-purple-900 uppercase tracking-widest mb-1">Your Question</p>
                <p className="text-gray-800 text-sm leading-relaxed">{q.question}</p>
              </div>

              {q.answer && (
                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-100">
                  <p className="text-xs font-bold text-green-900 uppercase tracking-widest mb-1">Pastor&rsquo;s Answer</p>
                  <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{q.answer}</p>
                  {q.answered_at && <p className="text-xs text-gray-500 mt-2">Answered on {formatDate(q.answered_at)}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg pointer-events-auto max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold text-brand-purple-900">❓ Ask a Question</h2>
                  <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Question <span className="text-red-500">*</span></label>
                  <textarea value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Type your question here..." rows={6} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" required />
                </div>
                <p className="text-xs text-gray-500">🔒 Your question is private and only visible to you and the Pastor.</p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50">
                    {isSubmitting ? "Sending..." : "📩 Submit Question"}
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