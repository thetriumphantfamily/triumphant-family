// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER PRAYER CLIENT — Submit and track prayer requests
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Prayer {
  id: string;
  prayer_point: string;
  category: string | null;
  status: string;
  is_answered: boolean;
  answer_testimony: string | null;
  created_at: string;
  answered_at: string | null;
}

const CATEGORIES = [
  "Healing", "Breakthrough", "Salvation", "Family", "Finance",
  "Career", "Deliverance", "Thanksgiving", "Other",
];

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function MemberPrayerClient() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ prayer_point: "", category: "Other" });
  const [filter, setFilter] = useState<"all" | "active" | "answered">("all");

  useEffect(() => { loadPrayers(); }, []);

  const loadPrayers = async () => {
    try {
      const session = localStorage.getItem("tfam_member_session");
      if (!session) return;
      const sessionData = JSON.parse(session);
      const supabase = createClient();
      const { data } = await supabase.from("tfam_member_prayers").select("*").eq("member_id", sessionData.id).order("created_at", { ascending: false });
      setPrayers(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.prayer_point.trim()) { toast.error("Please write your prayer request"); return; }
    setIsSubmitting(true);
    try {
      const session = localStorage.getItem("tfam_member_session");
      if (!session) return;
      const sessionData = JSON.parse(session);
      const supabase = createClient();
      const { error } = await supabase.from("tfam_member_prayers").insert({
        member_id: sessionData.id,
        prayer_point: formData.prayer_point.trim(),
        category: formData.category,
      });
      if (error) { toast.error(error.message); setIsSubmitting(false); return; }
      toast.success("🙏 Prayer request submitted!");
      setFormData({ prayer_point: "", category: "Other" });
      setShowForm(false);
      loadPrayers();
    } catch (err) { console.error(err); toast.error("Failed to submit"); }
    finally { setIsSubmitting(false); }
  };

  const markAnswered = async (id: string) => {
    const testimony = prompt("Share how God answered this prayer (optional):");
    try {
      const supabase = createClient();
      await supabase.from("tfam_member_prayers").update({
        is_answered: true, status: "answered", answer_testimony: testimony || null, answered_at: new Date().toISOString(),
      }).eq("id", id);
      toast.success("🎉 Praise the Lord! Prayer answered!");
      loadPrayers();
    } catch (err) { toast.error("Failed to update"); }
  };

  const filteredPrayers = prayers.filter((p) => {
    if (filter === "active") return !p.is_answered;
    if (filter === "answered") return p.is_answered;
    return true;
  });

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading prayers...</p></div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">🙏 My Prayer Requests</h1>
          <p className="text-gray-600 text-sm">Submit prayer requests and track God&rsquo;s answers</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all">
          ✏️ New Prayer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md text-center">
          <p className="text-3xl font-bold text-brand-purple-900">{prayers.length}</p>
          <p className="text-xs text-gray-600 font-semibold uppercase">Total</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-blue-200 shadow-md text-center">
          <p className="text-3xl font-bold text-blue-600">{prayers.filter((p) => !p.is_answered).length}</p>
          <p className="text-xs text-gray-600 font-semibold uppercase">Active</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-green-200 shadow-md text-center">
          <p className="text-3xl font-bold text-green-600">{prayers.filter((p) => p.is_answered).length}</p>
          <p className="text-xs text-gray-600 font-semibold uppercase">Answered</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "active", "answered"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all capitalize ${filter === f ? "bg-brand-purple-600 text-white shadow-md" : "bg-white text-gray-600 border-2 border-gray-200"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Prayers List */}
      {filteredPrayers.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">🙏</div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">No prayer requests yet</h3>
          <p className="text-gray-500">Click &ldquo;New Prayer&rdquo; to submit one</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPrayers.map((prayer) => (
            <div key={prayer.id} className={`bg-white rounded-2xl p-5 border-2 shadow-md ${prayer.is_answered ? "border-green-200" : "border-gray-100"}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-purple-100 text-brand-purple-700 text-xs font-bold">{prayer.category}</span>
                  {prayer.is_answered ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-300">✅ Answered</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-300">🙏 Active</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{formatDate(prayer.created_at)}</p>
              </div>
              <p className="text-gray-800 text-sm leading-relaxed mb-3">{prayer.prayer_point}</p>
              {prayer.answer_testimony && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 mb-3">
                  <p className="text-xs font-bold text-green-700 mb-1">🎉 Testimony:</p>
                  <p className="text-sm text-green-800">{prayer.answer_testimony}</p>
                </div>
              )}
              {!prayer.is_answered && (
                <button onClick={() => markAnswered(prayer.id)} className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition-all">
                  🎉 Mark as Answered
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit Form Modal */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold text-brand-purple-900">🙏 Submit Prayer Request</h2>
                  <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white">
                    {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Prayer Request <span className="text-red-500">*</span></label>
                  <textarea value={formData.prayer_point} onChange={(e) => setFormData({ ...formData, prayer_point: e.target.value })} placeholder="Share what's on your heart..." rows={6} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" required />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50">
                    {isSubmitting ? "Submitting..." : "🙏 Submit Prayer"}
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