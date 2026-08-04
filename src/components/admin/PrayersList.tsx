// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYERS LIST — Interactive prayer requests management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

interface Prayer {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  prayer_point: string;
  category: string;
  is_anonymous: boolean;
  is_approved: boolean;
  show_on_wall: boolean;
  is_answered: boolean;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

type FilterType = "all" | "pending" | "approved" | "answered" | "wall";

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  healing: { label: "Healing", emoji: "🙏" },
  breakthrough: { label: "Breakthrough", emoji: "⚡" },
  salvation: { label: "Salvation", emoji: "✝️" },
  marriage: { label: "Marriage", emoji: "💍" },
  family: { label: "Family", emoji: "👨‍👩‍👧‍👦" },
  finance: { label: "Finance", emoji: "💰" },
  career: { label: "Career", emoji: "💼" },
  deliverance: { label: "Deliverance", emoji: "🕊️" },
  thanksgiving: { label: "Thanksgiving", emoji: "🎉" },
  other: { label: "Other", emoji: "📖" },
};

export default function PrayersList({ initialPrayers }: { initialPrayers: Prayer[] }) {
  const router = useRouter();
  const [prayers, setPrayers] = useState<Prayer[]>(initialPrayers);
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [loading] = useState(false);

  if (loading) return <LoadingScreen message="Loading prayer requests..." />;

  const filteredPrayers = prayers.filter((p) => {
    if (filter === "pending") return !p.is_approved;
    if (filter === "approved") return p.is_approved && !p.is_answered;
    if (filter === "answered") return p.is_answered;
    if (filter === "wall") return p.is_approved && p.show_on_wall;
    return true;
  });

  const toggleApproved = async (id: string, currentIsApproved: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("prayer_requests").update({ is_approved: !currentIsApproved }).eq("id", id);
      if (error) throw error;
      setPrayers((prev) => prev.map((p) => p.id === id ? { ...p, is_approved: !currentIsApproved } : p));
      toast.success(currentIsApproved ? "Removed approval" : "Approved!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update prayer");
    } finally {
      setBusyId(null);
    }
  };

  const toggleAnswered = async (id: string, currentIsAnswered: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("prayer_requests").update({ is_answered: !currentIsAnswered }).eq("id", id);
      if (error) throw error;
      setPrayers((prev) => prev.map((p) => p.id === id ? { ...p, is_answered: !currentIsAnswered } : p));
      toast.success(currentIsAnswered ? "Marked as unanswered" : "🎉 Marked as answered!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update prayer");
    } finally {
      setBusyId(null);
    }
  };

  const toggleWall = async (id: string, currentShowOnWall: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("prayer_requests").update({ show_on_wall: !currentShowOnWall }).eq("id", id);
      if (error) throw error;
      setPrayers((prev) => prev.map((p) => p.id === id ? { ...p, show_on_wall: !currentShowOnWall } : p));
      toast.success(currentShowOnWall ? "Hidden from wall" : "Shown on wall");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update prayer");
    } finally {
      setBusyId(null);
    }
  };

  const saveNote = async (id: string) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("prayer_requests").update({ admin_note: noteText || null }).eq("id", id);
      if (error) throw error;
      setPrayers((prev) => prev.map((p) => p.id === id ? { ...p, admin_note: noteText || null } : p));
      setEditingNoteId(null);
      setNoteText("");
      toast.success("Note saved");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not save note");
    } finally {
      setBusyId(null);
    }
  };

  const deletePrayer = async (id: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("prayer_requests").delete().eq("id", id);
      if (error) throw error;
      setPrayers((prev) => prev.filter((p) => p.id !== id));
      toast.success("Prayer deleted");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not delete prayer");
    } finally {
      setBusyId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const buildWhatsAppUrl = (prayer: Prayer) => {
    if (!prayer.phone) return "";
    const phone = prayer.phone.replace(/\D/g, "");
    const message = `Hello ${prayer.full_name}, we received your prayer request at The Triumphant Family Ministry. We are praying with you. God bless you!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: "all" as const, label: "All" },
          { value: "pending" as const, label: "Pending" },
          { value: "approved" as const, label: "Approved" },
          { value: "answered" as const, label: "Answered" },
          { value: "wall" as const, label: "On Wall" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
              filter === tab.value
                ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                : "bg-white text-brand-purple-900 font-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredPrayers.length === 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-12 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">🙏</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">No prayer requests here</h3>
          <p className="text-brand-purple-200 font-semibold">
            {filter === "pending" && "All prayers have been reviewed."}
            {filter === "approved" && "No approved prayers yet."}
            {filter === "answered" && "No answered prayers yet — keep believing!"}
            {filter === "wall" && "No prayers on the wall yet."}
            {filter === "all" && "No prayer requests yet. They'll appear here when submitted."}
          </p>
        </div>
      )}

      {/* Prayers list */}
      <div className="space-y-3">
        {filteredPrayers.map((prayer) => {
          const isExpanded = expandedId === prayer.id;
          const isBusy = busyId === prayer.id;
          const isPending = !prayer.is_approved;
          const isEditing = editingNoteId === prayer.id;
          const category = CATEGORY_LABELS[prayer.category] || CATEGORY_LABELS.other;

          return (
            <div
              key={prayer.id}
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 transition-all ${
                isExpanded ? "border-brand-gold-400 shadow-2xl" : "border-brand-gold-400/40 shadow-xl"
              }`}
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : prayer.id)}
                className="w-full p-5 text-left flex items-start gap-4 hover:bg-brand-purple-950/30 transition-colors"
              >
                <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-black text-brand-purple-900 shadow-md ${
                  prayer.is_answered ? "bg-green-400" : isPending ? "bg-gradient-to-br from-brand-gold-400 to-brand-gold-500" : "bg-white"
                }`}>
                  {prayer.is_anonymous ? "?" : prayer.full_name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-heading font-black text-white truncate">
                          {prayer.is_anonymous ? "Anonymous" : prayer.full_name}
                        </h3>
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-wider">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                            Pending
                          </span>
                        )}
                        {prayer.is_answered && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-black uppercase tracking-wider">
                            ✓ Answered
                          </span>
                        )}
                        {prayer.is_approved && prayer.show_on_wall && !prayer.is_answered && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-purple-950/60 text-white text-[10px] font-black uppercase tracking-wider border border-brand-gold-400/40">
                            📌 On Wall
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black bg-brand-purple-950/60 text-white border border-brand-gold-400/40">
                          {category.emoji} {category.label}
                        </span>
                        {prayer.country && (
                          <span className="text-xs text-brand-purple-200 font-semibold">🌍 {prayer.country}</span>
                        )}
                      </div>
                      <p className="text-sm text-brand-purple-200 font-semibold line-clamp-2">{prayer.prayer_point}</p>
                    </div>
                    <span className="text-xs text-brand-purple-300 font-semibold whitespace-nowrap">{formatDate(prayer.created_at)}</span>
                  </div>
                </div>

                <svg className={`w-5 h-5 text-brand-gold-400 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded */}
              {isExpanded && (
                <div className="border-t border-brand-gold-400/30 p-5">
                  {/* Contact info */}
                  {(prayer.email || prayer.phone) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      {prayer.email && (
                        <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
                          <p className="text-xs text-brand-purple-200 uppercase tracking-widest font-semibold mb-1">Email</p>
                          <a href={`mailto:${prayer.email}`} className="text-brand-gold-400 font-semibold hover:underline break-all">{prayer.email}</a>
                        </div>
                      )}
                      {prayer.phone && (
                        <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
                          <p className="text-xs text-brand-purple-200 uppercase tracking-widest font-semibold mb-1">Phone</p>
                          <a href={`tel:${prayer.phone}`} className="text-brand-gold-400 font-semibold hover:underline">{prayer.phone}</a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Full prayer */}
                  <div className="bg-brand-purple-950/60 rounded-xl p-5 border border-brand-gold-400/30 mb-5">
                    <p className="text-xs text-brand-purple-200 uppercase tracking-widest font-semibold mb-2">Prayer Request</p>
                    <p className="text-white font-semibold whitespace-pre-line leading-relaxed italic">
                      &ldquo;{prayer.prayer_point}&rdquo;
                    </p>
                  </div>

                  {/* Admin note */}
                  <div className="bg-brand-purple-950/60 rounded-xl p-5 border border-brand-gold-400/30 mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-brand-purple-200 uppercase tracking-widest font-semibold">Admin Note</p>
                      {!isEditing && (
                        <button
                          onClick={() => { setEditingNoteId(prayer.id); setNoteText(prayer.admin_note || ""); }}
                          className="text-xs text-brand-gold-400 hover:underline font-black"
                        >
                          {prayer.admin_note ? "Edit" : "Add note"}
                        </button>
                      )}
                    </div>
                    {isEditing ? (
                      <div>
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add a private note about this prayer..."
                          className="w-full p-3 rounded-lg border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none text-sm resize-none font-semibold"
                          rows={3}
                        />
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => saveNote(prayer.id)} disabled={isBusy} className="px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 text-sm font-black transition-all disabled:opacity-50">Save</button>
                          <button onClick={() => { setEditingNoteId(null); setNoteText(""); }} className="px-4 py-2 rounded-full bg-white text-brand-purple-900 text-sm font-black transition-all">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-white font-semibold text-sm italic">
                        {prayer.admin_note || <span className="text-brand-purple-300">No note added yet</span>}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleApproved(prayer.id, prayer.is_approved)}
                      disabled={isBusy}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-black transition-all disabled:opacity-50 ${
                        prayer.is_approved
                          ? "bg-white text-brand-purple-900"
                          : "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                      }`}
                    >
                      {prayer.is_approved ? "❌ Remove Approval" : "✅ Approve"}
                    </button>
                    <button
                      onClick={() => toggleAnswered(prayer.id, prayer.is_answered)}
                      disabled={isBusy}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-black transition-all disabled:opacity-50 ${
                        prayer.is_answered
                          ? "bg-white text-brand-purple-900"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {prayer.is_answered ? "↩️ Mark Unanswered" : "🎉 Mark Answered"}
                    </button>
                    {prayer.is_approved && (
                      <button
                        onClick={() => toggleWall(prayer.id, prayer.show_on_wall)}
                        disabled={isBusy}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white text-brand-purple-900 text-sm font-black transition-all disabled:opacity-50"
                      >
                        {prayer.show_on_wall ? "🙈 Hide from Wall" : "📌 Show on Wall"}
                      </button>
                    )}
                    {prayer.phone && (
                      <a
                        href={buildWhatsAppUrl(prayer)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-green-600 text-white text-sm font-black shadow-lg transition-all"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                        </svg>
                        WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() => deletePrayer(prayer.id)}
                      disabled={isBusy}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-red-600 text-white text-sm font-black transition-all disabled:opacity-50"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}