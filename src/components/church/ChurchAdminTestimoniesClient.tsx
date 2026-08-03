// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN TESTIMONIES — Auto-fill location from member profile
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyMember } from "@/lib/notifications";

interface Testimony {
  id: string;
  member_id: string;
  title: string;
  testimony_text: string;
  category: string | null;
  is_approved: boolean;
  approval_type: string;
  created_at: string;
  member?: { full_name: string; email: string; photo_url: string | null; city: string | null; state: string | null } | null;
}

type ActiveTab = "pending" | "approved" | "public" | "rejected" | "all";

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

export default function ChurchAdminTestimoniesClient() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => { loadTestimonies(); }, []);

  const loadTestimonies = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tfam_member_testimonies")
        .select("*, member:tfam_members(full_name, email, photo_url, city, state)")
        .order("created_at", { ascending: false });
      setTestimonies((data as Testimony[]) || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const approveTestimony = async (id: string, type: "approved" | "public") => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const testimony = testimonies.find((t) => t.id === id);

      await supabase.from("tfam_member_testimonies").update({
        is_approved: true,
        approval_type: type,
      }).eq("id", id);

      if (type === "public" && testimony) {
        // Build location from member's city + state
        let location: string | null = null;
        if (testimony.member?.city && testimony.member?.state) {
          location = `${testimony.member.city}, ${testimony.member.state}`;
        } else if (testimony.member?.city) {
          location = testimony.member.city;
        } else if (testimony.member?.state) {
          location = testimony.member.state;
        }

        await supabase.from("testimonies").insert({
          full_name: testimony.member?.full_name || "Church Member",
          testimony_text: testimony.testimony_text,
          category: testimony.category || null,
          photo_url: testimony.member?.photo_url || null,
          location: location,
          is_featured: false,
          is_approved: true,
        });
      }

      if (testimony?.member_id) {
        await notifyMember({
          memberId: testimony.member_id,
          title: type === "public"
            ? "🌍 Testimony Published on Website!"
            : "✅ Testimony Approved!",
          message: type === "public"
            ? `Your testimony "${testimony.title}" has been approved and published on the church website for the world to see! Glory to God!`
            : `Your testimony "${testimony.title}" has been approved and is now visible to all church members!`,
          type: "testimony",
          link: "/member/testimonies",
        });
      }

      setTestimonies((prev) => prev.map((t) => t.id === id ? { ...t, is_approved: true, approval_type: type } : t));
      toast.success(type === "public" ? "🌍 Published on website!" : "✅ Approved for members!");
    } catch { toast.error("Failed"); }
    finally { setBusyId(null); }
  };

  const rejectTestimony = async (id: string) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const testimony = testimonies.find((t) => t.id === id);

      await supabase.from("tfam_member_testimonies").update({
        is_approved: false,
        approval_type: "rejected",
      }).eq("id", id);

      if (testimony?.member_id) {
        await notifyMember({
          memberId: testimony.member_id,
          title: "📝 Testimony Update",
          message: `Your testimony "${testimony.title}" needs revision. Please edit and resubmit.`,
          type: "testimony",
          link: "/member/testimonies",
        });
      }

      setTestimonies((prev) => prev.map((t) => t.id === id ? { ...t, is_approved: false, approval_type: "rejected" } : t));
      toast.success("Rejected and member notified");
    } catch { toast.error("Failed"); }
    finally { setBusyId(null); }
  };

  const deleteTestimony = async (id: string) => {
    if (!confirm("Delete this testimony permanently?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_member_testimonies").delete().eq("id", id);
      setTestimonies((prev) => prev.filter((t) => t.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const pending = testimonies.filter((t) => t.approval_type === "pending");
  const approved = testimonies.filter((t) => t.approval_type === "approved");
  const publicT = testimonies.filter((t) => t.approval_type === "public");
  const rejected = testimonies.filter((t) => t.approval_type === "rejected");

  const TABS = [
    { id: "pending", label: "⏳ Pending", count: pending.length, alert: pending.length > 0 },
    { id: "approved", label: "✅ Members", count: approved.length, alert: false },
    { id: "public", label: "🌍 Public", count: publicT.length, alert: false },
    { id: "rejected", label: "❌ Rejected", count: rejected.length, alert: false },
    { id: "all", label: "📋 All", count: testimonies.length, alert: false },
  ];

  const currentList =
    activeTab === "pending" ? pending :
    activeTab === "approved" ? approved :
    activeTab === "public" ? publicT :
    activeTab === "rejected" ? rejected :
    testimonies;

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div className="space-y-6">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">Member Testimonies</span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">Testimony Management</h1>
          <p className="text-brand-purple-100 text-sm md:text-base">Review, approve for members or publish to main website</p>
          <div className="flex gap-6 pt-4 mt-4 border-t border-brand-gold-400/30 flex-wrap">
            <div className="text-center">
              <p className={`font-black text-2xl ${pending.length > 0 ? "text-amber-300" : "text-white"}`}>{pending.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{approved.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase">Members</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{publicT.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase">Public</p>
            </div>
          </div>
        </div>
      </div>

      {pending.length > 0 && activeTab !== "pending" && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-700 via-amber-600 to-amber-700 border-2 border-amber-400/60 p-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="text-3xl animate-pulse">📖</div>
            <div className="flex-1">
              <p className="font-black text-white text-lg">{pending.length} testimon{pending.length > 1 ? "ies" : "y"} awaiting review!</p>
              <p className="text-white/80 font-semibold text-sm">Members are waiting for approval</p>
            </div>
            <button onClick={() => setActiveTab("pending")} className="px-4 py-2 rounded-full bg-white text-amber-700 font-black text-sm flex-shrink-0">Review Now</button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-black transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
            }`}>
            {tab.label}
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${tab.alert ? "bg-red-500 text-white" : ""}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {currentList.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">📖</div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">No {activeTab} testimonies</h3>
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((t) => {
            const isBusy = busyId === t.id;
            return (
              <div key={t.id} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                t.approval_type === "public" ? "border-green-400" :
                t.approval_type === "approved" ? "border-green-400/40" :
                t.approval_type === "rejected" ? "border-red-400/40" :
                "border-amber-400/60"
              } p-5 shadow-xl`}>
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {t.approval_type === "pending" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-400/40">⏳ Pending</span>}
                  {t.approval_type === "approved" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-green-500/20 text-green-300 border border-green-400/40">✅ Members Only</span>}
                  {t.approval_type === "public" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-green-500 text-white">🌍 Public Website</span>}
                  {t.approval_type === "rejected" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-red-500/20 text-red-300 border border-red-400/40">❌ Rejected</span>}
                  {t.category && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-purple-950/60 text-white border border-brand-gold-400/30">{t.category}</span>}
                  <span className="text-brand-purple-300 text-xs font-semibold">{timeAgo(t.created_at)}</span>
                </div>

                {t.member && (
                  <div className="flex items-center gap-3 mb-3">
                    {t.member.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.member.photo_url} alt={t.member.full_name} className="w-10 h-10 rounded-full object-cover border-2 border-brand-gold-400 flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-black flex-shrink-0">
                        {t.member.full_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-black text-sm">{t.member.full_name}</p>
                      <p className="text-brand-purple-300 text-xs">{t.member.email}</p>
                      {(t.member.city || t.member.state) && (
                        <p className="text-brand-purple-200 text-xs">
                          📍 {[t.member.city, t.member.state].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <p className="font-black text-white text-lg mb-2">{t.title}</p>
                <p className="text-white/80 font-semibold text-sm leading-relaxed whitespace-pre-wrap">{t.testimony_text}</p>

                <div className="flex gap-2 pt-3 border-t border-brand-gold-400/30 mt-3 flex-wrap">
                  {t.approval_type === "pending" && (
                    <>
                      <button onClick={() => approveTestimony(t.id, "approved")} disabled={isBusy} className="px-3 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white text-xs font-black transition-all disabled:opacity-50">✅ Approve (Members)</button>
                      <button onClick={() => approveTestimony(t.id, "public")} disabled={isBusy} className="px-3 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-black transition-all disabled:opacity-50">🌍 Publish to Website</button>
                      <button onClick={() => rejectTestimony(t.id)} disabled={isBusy} className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-300 text-xs font-bold disabled:opacity-50">❌ Reject</button>
                    </>
                  )}
                  {t.approval_type === "approved" && (
                    <button onClick={() => approveTestimony(t.id, "public")} disabled={isBusy} className="px-3 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-black transition-all disabled:opacity-50">🌍 Also Publish to Website</button>
                  )}
                  {t.approval_type === "rejected" && (
                    <button onClick={() => approveTestimony(t.id, "approved")} disabled={isBusy} className="px-3 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white text-xs font-black transition-all disabled:opacity-50">✅ Approve Now</button>
                  )}
                  <button onClick={() => deleteTestimony(t.id)} className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-300 text-xs font-bold">🗑️ Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}