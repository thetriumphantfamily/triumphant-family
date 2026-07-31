// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN PRAYER REQUESTS — View and manage member prayer requests
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Prayer {
  id: string;
  member_id: string | null;
  prayer_point: string;
  category: string | null;
  status: string;
  is_answered: boolean;
  answer_testimony: string | null;
  created_at: string;
  answered_at: string | null;
  member?: { full_name: string } | null;
}

type ActiveTab = "active" | "answered" | "all";

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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function ChurchAdminPrayerClient() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("active");

  useEffect(() => { loadPrayers(); }, []);

  const loadPrayers = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tfam_member_prayers")
        .select("*, member:tfam_members(full_name)")
        .order("created_at", { ascending: false });
      setPrayers((data as Prayer[]) || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
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

  const activePrayers = prayers.filter((p) => !p.is_answered);
  const answeredPrayers = prayers.filter((p) => p.is_answered);

  const TABS = [
    { id: "active", label: "🙏 Active", count: activePrayers.length, alert: activePrayers.length > 0 },
    { id: "answered", label: "🎉 Answered", count: answeredPrayers.length, alert: false },
    { id: "all", label: "📋 All", count: prayers.length, alert: false },
  ];

  const currentList = activeTab === "active" ? activePrayers : activeTab === "answered" ? answeredPrayers : prayers;

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">
              Prayer Requests
            </span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            Member Prayer Requests
          </h1>
          <p className="text-brand-purple-100 text-sm md:text-base">
            View and track prayer requests from your members
          </p>
          <div className="flex gap-6 pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{prayers.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total</p>
            </div>
            <div className="text-center">
              <p className={`font-black text-2xl ${activePrayers.length > 0 ? "text-amber-300" : "text-white"}`}>{activePrayers.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Active</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{answeredPrayers.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Answered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`relative rounded-2xl overflow-hidden p-3 transition-all text-left ${
              activeTab === tab.id
                ? "bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400 shadow-xl"
                : "bg-gradient-to-br from-brand-violet-900/80 via-brand-purple-800/80 to-brand-purple-900/80 border-2 border-brand-gold-400/40 hover:border-brand-gold-400/70"
            }`}
          >
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <p className="font-black text-white text-xs">{tab.label}</p>
            <p className={`font-black text-lg ${tab.alert ? "text-amber-300" : "text-white"}`}>{tab.count}</p>
          </button>
        ))}
      </div>

      {/* Prayer List */}
      {currentList.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">🙏</div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            No {activeTab === "all" ? "" : activeTab} prayer requests
          </h3>
          <p className="text-gray-500">
            {activeTab === "active" ? "Members haven't submitted any prayer requests yet" : "No prayers to show"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((p) => (
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

              {p.member && (
                <p className="text-brand-gold-300 font-black text-sm mb-2">👤 {p.member.full_name}</p>
              )}

              <p className="text-white font-semibold text-base leading-relaxed mb-3">{p.prayer_point}</p>

              {p.is_answered && p.answer_testimony && (
                <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-green-400/40 mb-3">
                  <p className="text-green-300 text-xs font-black uppercase tracking-widest mb-2">🎉 Testimony from Member</p>
                  <p className="text-white font-semibold text-sm leading-relaxed">{p.answer_testimony}</p>
                  {p.answered_at && (
                    <p className="text-green-300 text-xs mt-2 font-semibold">
                      ✅ Answered on {formatDate(p.answered_at)}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-3 border-t border-brand-gold-400/30">
                <button
                  onClick={() => deletePrayer(p.id)}
                  className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-300 text-xs font-bold hover:bg-red-500/30 transition-colors"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}