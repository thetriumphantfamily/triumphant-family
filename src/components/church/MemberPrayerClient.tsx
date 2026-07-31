// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER PRAYER REQUESTS — Submit + track + notify admin
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyAdmin } from "@/lib/notifications";

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
  "Healing",
  "Family",
  "Finance",
  "Marriage",
  "Career",
  "Salvation",
  "Deliverance",
  "Guidance",
  "Other",
];

function timeAgo(d: string): string {
  const now = new Date();
  const then = new Date(d);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MemberPrayerClient() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [showAnswerForm, setShowAnswerForm] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");

  const [formData, setFormData] = useState({
    prayer_point: "",
    category: "Healing",
  });

  useEffect(() => {
    loadMemberAndPrayers();
  }, []);

  const loadMemberAndPrayers = async () => {
    let foundId = "";
    let foundName = "";

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.includes("member") || key.includes("tfam")) {
          try {
            const val = localStorage.getItem(key);
            if (val) {
              const parsed = JSON.parse(val);
              if (parsed.full_name) {
                foundName = parsed.full_name;
                if (parsed.id) foundId = parsed.id;
                break;
              }
            }
          } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ }

    setMemberId(foundId);
    setMemberName(foundName);

    if (foundId) {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("tfam_member_prayers")
          .select("*")
          .eq("member_id", foundId)
          .order("created_at", { ascending: false });
        setPrayers(data || []);
      } catch (err) { console.error(err); }
    }

    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.prayer_point.trim()) { toast.error("Enter your prayer point"); return; }
    if (!memberId) { toast.error("Please login again"); return; }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tfam_member_prayers").insert({
        member_id: memberId,
        prayer_point: formData.prayer_point.trim(),
        category: formData.category,
        status: "active",
      });

      if (error) { toast.error(error.message); setIsSubmitting(false); return; }

      // 🔔 NOTIFY ADMIN
      await notifyAdmin({
        title: "🙏 New Prayer Request",
        message: `${memberName || "A member"} submitted a prayer request (${formData.category}): "${formData.prayer_point.substring(0, 100)}${formData.prayer_point.length > 100 ? "..." : ""}"`,
        type: "prayer",
        link: "/admin/church/prayer",
      });

      toast.success("🙏 Prayer request submitted!");
      setFormData({ prayer_point: "", category: "Healing" });
      setShowForm(false);
      loadMemberAndPrayers();
    } catch { toast.error("Failed to submit"); }
    finally { setIsSubmitting(false); }
  };

  const markAnswered = async (id: string) => {
    if (!answerText.trim()) { toast.error("Please share your testimony"); return; }

    try {
      const supabase = createClient();
      await supabase.from("tfam_member_prayers").update({
        is_answered: true,
        status: "answered",
        answer_testimony: answerText.trim(),
        answered_at: new Date().toISOString(),
      }).eq("id", id);

      // 🔔 NOTIFY ADMIN
      await notifyAdmin({
        title: "🎉 Answered Prayer Testimony",
        message: `${memberName || "A member"} testified an answered prayer: "${answerText.substring(0, 100)}${answerText.length > 100 ? "..." : ""}"`,
        type: "prayer",
        link: "/admin/church/prayer",
      });

      toast.success("🎉 Praise God for answered prayer!");
      setShowAnswerForm(null);
      setAnswerText("");
      loadMemberAndPrayers();
    } catch { toast.error("Failed"); }
  };

  const deletePrayer = async (id: string) => {
    if (!confirm("Delete this prayer request?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_member_prayers").delete().eq("id", id);
      setPrayers((prev) => prev.filter((p) => p.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const firstName = memberName.split(" ")[0] || "";
  const activeCount = prayers.filter((p) => !p.is_answered).length;
  const answeredCount = prayers.filter((p) => p.is_answered).length;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">🙏</div>
          <p className="text-gray-500">Loading prayer requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">
              Prayer Requests
            </span>
          </div>
          <p className="text-white/80 font-semibold text-lg mb-1">
            {getGreeting()}{firstName ? `, ${firstName}` : ""}!
          </p>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            Your Prayer Requests
          </h1>
          <p className="text-brand-purple-100 text-sm md:text-base">
            Submit prayer requests and testify when God answers
          </p>
          <div className="flex gap-4 pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{prayers.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{activeCount}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Active</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{answeredCount}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Answered</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all">
          ➕ Submit Prayer Request
        </button>
      </div>

      {prayers.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">🙏</div>
          <h2 className="font-heading text-xl font-bold text-white mb-2">No Prayer Requests Yet</h2>
          <p className="text-brand-purple-200 text-sm">Submit your first prayer request. God is listening!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prayers.map((p) => (
            <div key={p.id} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${p.is_answered ? "border-green-400/40" : "border-brand-gold-400/40"} p-5 shadow-xl`}>
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              <div className="flex items-center gap-2 flex-wrap mb-3">
                {p.is_answered ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-green-500/20 text-green-300 border border-green-400/40">
                    ✅ Answered
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    🙏 Praying
                  </span>
                )}
                {p.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-purple-950/60 text-white border border-brand-gold-400/30">
                    {p.category}
                  </span>
                )}
                <span className="text-brand-purple-300 text-xs font-semibold">{timeAgo(p.created_at)}</span>
              </div>

              <p className="text-white font-semibold text-base leading-relaxed mb-3">{p.prayer_point}</p>

              {p.is_answered && p.answer_testimony && (
                <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-green-400/40 mb-3">
                  <p className="text-green-300 text-xs font-black uppercase tracking-widest mb-2">🎉 Your Testimony</p>
                  <p className="text-white font-semibold text-sm leading-relaxed">{p.answer_testimony}</p>
                </div>
              )}

              <div className="flex gap-2 pt-3 border-t border-brand-gold-400/30 flex-wrap">
                {!p.is_answered && (
                  <button onClick={() => { setShowAnswerForm(p.id); setAnswerText(""); }} className="px-3 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white text-xs font-black transition-all">
                    🎉 Mark as Answered
                  </button>
                )}
                <button onClick={() => deletePrayer(p.id)} className="px-3 py-1.5 rounded-full bg-brand-purple-950/60 text-white text-xs font-bold border border-brand-gold-400/30">
                  🗑️ Delete
                </button>
              </div>

              {/* Answer Form */}
              {showAnswerForm === p.id && (
                <div className="mt-4 pt-4 border-t-2 border-green-400/40">
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    rows={3}
                    placeholder="Share how God answered your prayer..."
                    className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none resize-none font-semibold text-sm"
                  />
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => { setShowAnswerForm(null); setAnswerText(""); }} className="px-4 py-2 rounded-full bg-brand-purple-950/60 text-white text-sm font-bold border border-brand-gold-400/40">
                      Cancel
                    </button>
                    <button onClick={() => markAnswered(p.id)} className="flex-1 px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-black transition-all">
                      ✅ Submit Testimony
                    </button>
                  </div>
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
                  <h2 className="font-heading text-xl font-bold text-brand-purple-900">🙏 Submit Prayer Request</h2>
                  <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Prayer Point <span className="text-red-500">*</span></label>
                  <textarea value={formData.prayer_point} onChange={(e) => setFormData({ ...formData, prayer_point: e.target.value })} rows={5} placeholder="Share what you need prayer for..." required className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all disabled:opacity-50">
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