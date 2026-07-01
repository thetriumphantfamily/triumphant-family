// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYERS LIST — Interactive prayer requests management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

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

const CATEGORY_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  healing: { label: "Healing", emoji: "🙏", color: "bg-blue-100 text-blue-700 border-blue-200" },
  breakthrough: { label: "Breakthrough", emoji: "⚡", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  salvation: { label: "Salvation", emoji: "✝️", color: "bg-purple-100 text-purple-700 border-purple-200" },
  marriage: { label: "Marriage", emoji: "💍", color: "bg-pink-100 text-pink-700 border-pink-200" },
  family: { label: "Family", emoji: "👨‍👩‍👧‍👦", color: "bg-orange-100 text-orange-700 border-orange-200" },
  finance: { label: "Finance", emoji: "💰", color: "bg-green-100 text-green-700 border-green-200" },
  career: { label: "Career", emoji: "💼", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  deliverance: { label: "Deliverance", emoji: "🕊️", color: "bg-teal-100 text-teal-700 border-teal-200" },
  thanksgiving: { label: "Thanksgiving", emoji: "🎉", color: "bg-amber-100 text-amber-700 border-amber-200" },
  other: { label: "Other", emoji: "📖", color: "bg-gray-100 text-gray-700 border-gray-200" },
};

export default function PrayersList({
  initialPrayers,
}: {
  initialPrayers: Prayer[];
}) {
  const router = useRouter();
  const [prayers, setPrayers] = useState<Prayer[]>(initialPrayers);
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  // ━━━ Filter prayers ━━━
  const filteredPrayers = prayers.filter((p) => {
    if (filter === "pending") return !p.is_approved;
    if (filter === "approved") return p.is_approved && !p.is_answered;
    if (filter === "answered") return p.is_answered;
    if (filter === "wall") return p.is_approved && p.show_on_wall;
    return true; // "all"
  });

  // ━━━ Toggle approved ━━━
  const toggleApproved = async (id: string, currentIsApproved: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("prayer_requests")
        .update({ is_approved: !currentIsApproved })
        .eq("id", id);

      if (error) throw error;

      setPrayers((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, is_approved: !currentIsApproved } : p
        )
      );
      toast.success(currentIsApproved ? "Removed approval" : "Approved!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update prayer");
    } finally {
      setBusyId(null);
    }
  };

  // ━━━ Toggle answered ━━━
  const toggleAnswered = async (id: string, currentIsAnswered: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("prayer_requests")
        .update({ is_answered: !currentIsAnswered })
        .eq("id", id);

      if (error) throw error;

      setPrayers((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, is_answered: !currentIsAnswered } : p
        )
      );
      toast.success(
        currentIsAnswered ? "Marked as unanswered" : "🎉 Marked as answered!"
      );
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update prayer");
    } finally {
      setBusyId(null);
    }
  };

  // ━━━ Toggle show on wall ━━━
  const toggleWall = async (id: string, currentShowOnWall: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("prayer_requests")
        .update({ show_on_wall: !currentShowOnWall })
        .eq("id", id);

      if (error) throw error;

      setPrayers((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, show_on_wall: !currentShowOnWall } : p
        )
      );
      toast.success(currentShowOnWall ? "Hidden from wall" : "Shown on wall");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update prayer");
    } finally {
      setBusyId(null);
    }
  };

  // ━━━ Save admin note ━━━
  const saveNote = async (id: string) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("prayer_requests")
        .update({ admin_note: noteText || null })
        .eq("id", id);

      if (error) throw error;

      setPrayers((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, admin_note: noteText || null } : p
        )
      );
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

  // ━━━ Delete prayer ━━━
  const deletePrayer = async (id: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;

    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("prayer_requests")
        .delete()
        .eq("id", id);

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

  // ━━━ Format date ━━━
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
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ━━━ Build WhatsApp URL ━━━
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
                ? "bg-gradient-to-br from-brand-purple-600 to-brand-purple-700 text-white shadow-brand"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-brand-purple-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredPrayers.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-purple-100 mb-4">
            <svg
              className="w-10 h-10 text-brand-purple-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            No prayer requests here
          </h3>
          <p className="text-gray-500">
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
              className={`bg-white rounded-2xl border-2 transition-all overflow-hidden ${
                isPending
                  ? "border-orange-300 shadow-md"
                  : prayer.is_answered
                  ? "border-green-300"
                  : "border-gray-100"
              } ${isExpanded ? "border-brand-gold-400 shadow-lg" : ""}`}
            >
              {/* Header (always visible) */}
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : prayer.id)
                }
                className="w-full p-5 text-left flex items-start gap-4 hover:bg-gray-50 transition-colors"
              >
                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white shadow-md ${
                    prayer.is_answered
                      ? "bg-gradient-to-br from-green-500 to-green-700"
                      : isPending
                      ? "bg-gradient-to-br from-orange-500 to-orange-700"
                      : "bg-gradient-to-br from-brand-purple-500 to-brand-purple-700"
                  }`}
                >
                  {prayer.is_anonymous
                    ? "?"
                    : prayer.full_name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-heading font-bold text-brand-purple-900 truncate">
                          {prayer.is_anonymous ? "Anonymous" : prayer.full_name}
                        </h3>

                        {/* Status badges */}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                            Pending
                          </span>
                        )}
                        {prayer.is_answered && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider">
                            ✓ Answered
                          </span>
                        )}
                        {prayer.is_approved && prayer.show_on_wall && !prayer.is_answered && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider">
                            📍 On Wall
                          </span>
                        )}
                      </div>

                      {/* Category + Country */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${category.color}`}>
                          {category.emoji} {category.label}
                        </span>
                        {prayer.country && (
                          <span className="text-xs text-gray-500">
                            🌍 {prayer.country}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {prayer.prayer_point}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                      {formatDate(prayer.created_at)}
                    </span>
                  </div>
                </div>

                {/* Expand icon */}
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-5 bg-gray-50">
                  {/* Contact info */}
                  {(prayer.email || prayer.phone) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      {prayer.email && (
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
                            Email
                          </p>
                          <a
                            href={`mailto:${prayer.email}`}
                            className="text-brand-purple-600 font-semibold hover:underline break-all"
                          >
                            {prayer.email}
                          </a>
                        </div>
                      )}
                      {prayer.phone && (
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
                            Phone
                          </p>
                          <a
                            href={`tel:${prayer.phone}`}
                            className="text-brand-purple-600 font-semibold hover:underline"
                          >
                            {prayer.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Full prayer */}
                  <div className="bg-white rounded-xl p-5 border border-gray-100 mb-5">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">
                      Prayer Request
                    </p>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed italic">
                      &ldquo;{prayer.prayer_point}&rdquo;
                    </p>
                  </div>

                  {/* Admin note */}
                  <div className="bg-white rounded-xl p-5 border border-gray-100 mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                        Admin Note
                      </p>
                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingNoteId(prayer.id);
                            setNoteText(prayer.admin_note || "");
                          }}
                          className="text-xs text-brand-purple-600 hover:underline font-bold"
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
                          className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-700 text-sm resize-none"
                          rows={3}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => saveNote(prayer.id)}
                            disabled={isBusy}
                            className="px-4 py-2 rounded-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white text-sm font-bold transition-all disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingNoteId(null);
                              setNoteText("");
                            }}
                            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 text-sm italic">
                        {prayer.admin_note || (
                          <span className="text-gray-400">No note added yet</span>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    {/* Approve/Unapprove */}
                    <button
                      onClick={() => toggleApproved(prayer.id, prayer.is_approved)}
                      disabled={isBusy}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-md transition-all disabled:opacity-50 ${
                        prayer.is_approved
                          ? "bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700"
                          : "bg-gradient-to-br from-brand-purple-600 to-brand-purple-700 hover:from-brand-purple-700 hover:to-brand-purple-800 text-white shadow-brand"
                      }`}
                    >
                      {prayer.is_approved ? "❌ Remove Approval" : "✅ Approve"}
                    </button>

                    {/* Mark Answered */}
                    <button
                      onClick={() => toggleAnswered(prayer.id, prayer.is_answered)}
                      disabled={isBusy}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-md transition-all disabled:opacity-50 ${
                        prayer.is_answered
                          ? "bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700"
                          : "bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                      }`}
                    >
                      {prayer.is_answered ? "↩️ Mark Unanswered" : "🎉 Mark Answered"}
                    </button>

                    {/* Show on Wall */}
                    {prayer.is_approved && (
                      <button
                        onClick={() => toggleWall(prayer.id, prayer.show_on_wall)}
                        disabled={isBusy}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 text-sm font-bold transition-all disabled:opacity-50"
                      >
                        {prayer.show_on_wall ? "🙈 Hide from Wall" : "📍 Show on Wall"}
                      </button>
                    )}

                    {/* WhatsApp Reply (if phone) */}
                    {prayer.phone && (
                      <a
                        href={buildWhatsAppUrl(prayer)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold shadow-lg transition-all"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                        </svg>
                        WhatsApp
                      </a>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => deletePrayer(prayer.id)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 text-sm font-bold transition-all disabled:opacity-50 ml-auto"
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