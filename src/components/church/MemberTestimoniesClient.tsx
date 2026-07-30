// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER TESTIMONIES CLIENT — Share and view personal testimonies
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Testimony {
  id: string;
  title: string;
  testimony_text: string;
  category: string | null;
  is_approved: boolean;
  created_at: string;
}

const CATEGORIES = [
  "Healing", "Breakthrough", "Salvation", "Marriage", "Family",
  "Finance", "Career", "Deliverance", "Thanksgiving", "Other",
];

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function MemberTestimoniesClient() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", testimony_text: "", category: "Thanksgiving" });

  useEffect(() => { loadTestimonies(); }, []);

  const loadTestimonies = async () => {
    try {
      const session = localStorage.getItem("tfam_member_session");
      if (!session) return;
      const sessionData = JSON.parse(session);
      const supabase = createClient();
      const { data } = await supabase.from("tfam_member_testimonies").select("*").eq("member_id", sessionData.id).order("created_at", { ascending: false });
      setTestimonies(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.testimony_text.trim()) { toast.error("Please fill all required fields"); return; }
    setIsSubmitting(true);
    try {
      const session = localStorage.getItem("tfam_member_session");
      if (!session) return;
      const sessionData = JSON.parse(session);
      const supabase = createClient();
      const { error } = await supabase.from("tfam_member_testimonies").insert({
        member_id: sessionData.id,
        title: formData.title.trim(),
        testimony_text: formData.testimony_text.trim(),
        category: formData.category,
      });
      if (error) { toast.error(error.message); setIsSubmitting(false); return; }
      toast.success("🎉 Testimony shared! It will be reviewed by admin.");
      setFormData({ title: "", testimony_text: "", category: "Thanksgiving" });
      setShowForm(false);
      loadTestimonies();
    } catch (err) { console.error(err); toast.error("Failed to submit"); }
    finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading testimonies...</p></div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">📝 My Testimonies</h1>
          <p className="text-gray-600 text-sm">Share what God has done and inspire others</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all">
          ✏️ Share Testimony
        </button>
      </div>

      {/* List */}
      {testimonies.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">No testimonies yet</h3>
          <p className="text-gray-500">Share what God has done in your life!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonies.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                {t.category && <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-purple-100 text-brand-purple-700 text-xs font-bold">{t.category}</span>}
                {t.is_approved ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-300">✅ Approved</span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-300">⏳ Pending</span>
                )}
                <span className="text-xs text-gray-500 ml-auto">{formatDate(t.created_at)}</span>
              </div>
              <h3 className="font-heading font-bold text-brand-purple-900 text-lg mb-2">{t.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{t.testimony_text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold text-brand-purple-900">🎉 Share Your Testimony</h2>
                  <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. God healed my mother" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white">
                    {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Testimony <span className="text-red-500">*</span></label>
                  <textarea value={formData.testimony_text} onChange={(e) => setFormData({ ...formData, testimony_text: e.target.value })} placeholder="Share what God has done..." rows={8} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" required />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50">
                    {isSubmitting ? "Submitting..." : "🎉 Share Testimony"}
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