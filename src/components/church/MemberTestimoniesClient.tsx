// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER TESTIMONIES – 2 tabs: Church Testimonies + My Submissions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyAdmin } from "@/lib/notifications";
import LoadingScreen from "./LoadingScreen";

interface Testimony {
  id: string;
  member_id: string;
  title: string;
  testimony_text: string;
  category: string | null;
  is_approved: boolean;
  approval_type: string;
  created_at: string;
  member?: { full_name: string; photo_url: string | null } | null;
}

type ActiveTab = "all" | "mine";

const CATEGORIES = [
  "Healing", "Financial Breakthrough", "Deliverance",
  "Family Restoration", "Career Success", "Salvation",
  "Marriage", "Other",
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

export default function MemberTestimoniesClient() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [allTestimonies, setAllTestimonies] = useState<Testimony[]>([]);
  const [myTestimonies, setMyTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    testimony_text: "",
    category: "Healing",
  });

  useEffect(() => { loadEverything(); }, []);

  const loadEverything = async () => {
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

    try {
      const supabase = createClient();

      const { data: approved } = await supabase
        .from("tfam_member_testimonies")
        .select("*, member:tfam_members(full_name, photo_url)")
        .in("approval_type", ["approved", "public"])
        .order("created_at", { ascending: false });

      setAllTestimonies((approved as Testimony[]) || []);

      if (foundId) {
        const { data: mine } = await supabase
          .from("tfam_member_testimonies")
          .select("*")
          .eq("member_id", foundId)
          .order("created_at", { ascending: false });
        setMyTestimonies(mine || []);
      }
    } catch (err) { console.error(err); }

    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.testimony_text.trim()) {
      toast.error("Title and testimony required");
      return;
    }
    if (!memberId) { toast.error("Please login again"); return; }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tfam_member_testimonies").insert({
        member_id: memberId,
        title: formData.title.trim(),
        testimony_text: formData.testimony_text.trim(),
        category: formData.category,
        is_approved: false,
        approval_type: "pending",
      });

      if (error) { toast.error(error.message); setIsSubmitting(false); return; }

      await notifyAdmin({
        title: "📖 New Testimony Submitted",
        message: `${memberName || "A member"} shared a testimony (${formData.category}): "${formData.title}"`,
        type: "testimony",
        link: "/admin/church/testimonies",
      });

      toast.success("📖 Testimony submitted for approval!");
      setFormData({ title: "", testimony_text: "", category: "Healing" });
      setShowForm(false);
      loadEverything();
    } catch { toast.error("Failed to submit"); }
    finally { setIsSubmitting(false); }
  };

  const deleteTestimony = async (id: string) => {
    if (!confirm("Delete this testimony?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_member_testimonies").delete().eq("id", id);
      setMyTestimonies((prev) => prev.filter((t) => t.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const shareToWhatsApp = (t: Testimony) => {
    const text = `📖 *${t.title}*\n\n${t.testimony_text}\n\n— ${t.member?.full_name || "Church Member"}\n🙏 The Triumphant Family Ministry`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const firstName = memberName.split(" ")[0] || "";
  const pendingCount = myTestimonies.filter((t) => t.approval_type === "pending").length;

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading testimonies..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs md:text-sm uppercase tracking-widest">
              Testimonies
            </span>
          </div>
          <p className="text-white/80 font-semibold text-base mb-1">
            {getGreeting()}{firstName ? `, ${firstName}` : ""}!
          </p>
          <h1 className="font-heading text-xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
            Testimonies
          </h1>
          <p className="text-brand-purple-100 text-sm">
            Share what God has done and read testimonies from the family.
          </p>
          <div className="flex gap-4 flex-wrap pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{allTestimonies.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Church</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{myTestimonies.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Mine</p>
            </div>
            {pendingCount > 0 && (
              <div className="text-center">
                <p className="text-white font-black text-2xl">{pendingCount}</p>
                <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Pending</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`relative rounded-2xl overflow-hidden p-4 transition-all text-left ${
            activeTab === "all"
              ? "bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400 shadow-xl"
              : "bg-gradient-to-br from-brand-violet-900/80 via-brand-purple-800/80 to-brand-purple-900/80 border-2 border-brand-gold-400/40"
          }`}
        >
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center text-xl">
              📖
            </div>
            <p className="font-black text-white text-sm">Church</p>
            <p className="text-brand-purple-200 text-xs">{allTestimonies.length} approved</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("mine")}
          className={`relative rounded-2xl overflow-hidden p-4 transition-all text-left ${
            activeTab === "mine"
              ? "bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400 shadow-xl"
              : "bg-gradient-to-br from-brand-violet-900/80 via-brand-purple-800/80 to-brand-purple-900/80 border-2 border-brand-gold-400/40"
          }`}
        >
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center text-xl">
              ✍️
            </div>
            <p className="font-black text-white text-sm">My Testimonies</p>
            <p className="text-brand-purple-200 text-xs">{myTestimonies.length} submitted</p>
          </div>
        </button>
      </div>

      {/* ── Share Button — full width mobile ── */}
      <button
        onClick={() => { setActiveTab("mine"); setShowForm(true); }}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
      >
        ➕ Share a Testimony
      </button>

      {/* ── TAB: ALL CHURCH TESTIMONIES ── */}
      {activeTab === "all" && (
        <div className="space-y-3">
          {allTestimonies.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="text-5xl mb-4">📖</div>
              <h2 className="font-heading text-xl font-bold text-white mb-2">No Testimonies Yet</h2>
              <p className="text-brand-purple-200 text-sm">Be the first to share what God has done!</p>
            </div>
          ) : (
            allTestimonies.map((t) => (
              <div
                key={t.id}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl"
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                {/* Member Info */}
                <div className="flex items-center gap-3 mb-3">
                  {t.member?.photo_url ? (
                    <img
                      src={t.member.photo_url}
                      alt={t.member.full_name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-brand-gold-400/40 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-purple-950/80 border-2 border-brand-gold-400/40 flex items-center justify-center text-white font-black flex-shrink-0">
                      {t.member?.full_name?.charAt(0) || "?"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-black text-sm truncate">
                      {t.member?.full_name || "Church Member"}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {t.category && (
                        <span className="text-white/60 text-xs">{t.category}</span>
                      )}
                      <span className="text-brand-purple-300 text-xs">
                        {timeAgo(t.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="font-black text-white text-base mb-2">{t.title}</p>
                <p className="text-white/80 font-semibold text-sm leading-relaxed whitespace-pre-wrap">
                  {t.testimony_text}
                </p>

                {/* Share — full width mobile */}
                <div className="pt-3 border-t border-brand-gold-400/30 mt-3">
                  <button
                    onClick={() => shareToWhatsApp(t)}
                    className="w-full py-3 rounded-xl bg-green-600 text-white text-sm font-black active:scale-95 transition-all"
                  >
                    📱 Share on WhatsApp
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── TAB: MY TESTIMONIES ── */}
      {activeTab === "mine" && (
        <div className="space-y-3">
          {myTestimonies.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="text-5xl mb-4">✍️</div>
              <h2 className="font-heading text-xl font-bold text-white mb-2">No Submissions Yet</h2>
              <p className="text-brand-purple-200 text-sm mb-4">Share what God has done for you!</p>
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
              >
                ➕ Share Your First Testimony
              </button>
            </div>
          ) : (
            myTestimonies.map((t) => (
              <div
                key={t.id}
                className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                  t.approval_type === "public"
                    ? "border-green-400"
                    : t.approval_type === "approved"
                    ? "border-green-400/40"
                    : t.approval_type === "rejected"
                    ? "border-red-400/40"
                    : "border-brand-gold-400/40"
                } p-5 shadow-xl`}
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                {/* Status Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {t.approval_type === "pending" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-brand-purple-950/60 text-white/80 border border-brand-gold-400/40">
                      ⏳ Pending Approval
                    </span>
                  )}
                  {t.approval_type === "approved" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-green-500/20 text-green-300 border border-green-400/40">
                      ✅ Approved (Members)
                    </span>
                  )}
                  {t.approval_type === "public" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-green-500 text-white">
                      🌍 Published on Website!
                    </span>
                  )}
                  {t.approval_type === "rejected" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-red-500/20 text-red-300 border border-red-400/40">
                      ❌ Needs Revision
                    </span>
                  )}
                  {t.category && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-purple-950/60 text-white/80 border border-brand-gold-400/30">
                      {t.category}
                    </span>
                  )}
                  <span className="text-brand-purple-300 text-xs font-semibold">
                    {timeAgo(t.created_at)}
                  </span>
                </div>

                <p className="font-black text-white text-base mb-2">{t.title}</p>
                <p className="text-white/80 font-semibold text-sm leading-relaxed whitespace-pre-wrap">
                  {t.testimony_text}
                </p>

                {/* Delete — full width mobile */}
                {t.approval_type === "pending" && (
                  <div className="pt-3 border-t border-brand-gold-400/30 mt-3">
                    <button
                      onClick={() => deleteTestimony(t.id)}
                      className="w-full py-3 rounded-xl bg-brand-purple-950/60 text-white/70 text-sm font-bold border border-brand-gold-400/30 active:scale-95 transition-all"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Submit Form Modal — KEEP bg-white — slides up on mobile ── */}
      {showForm && (
        <>
          <div
            onClick={() => setShowForm(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">
                    📖 Share Testimony
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. God Healed Me"
                    required
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Testimony <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.testimony_text}
                    onChange={(e) => setFormData({ ...formData, testimony_text: e.target.value })}
                    rows={6}
                    placeholder="Share what God has done for you in detail..."
                    required
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
                  />
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "📖 Submit for Approval"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold"
                  >
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