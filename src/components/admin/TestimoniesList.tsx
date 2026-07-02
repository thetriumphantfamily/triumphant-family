// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TESTIMONIES LIST — Interactive testimony management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Testimony {
  id: string;
  full_name: string;
  email: string | null;
  location: string | null;
  testimony_text: string;
  category: string | null;
  photo_url: string | null;
  video_url: string | null;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

type FilterType = "all" | "pending" | "approved" | "featured";

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

export default function TestimoniesList({
  initialTestimonies,
}: {
  initialTestimonies: Testimony[];
}) {
  const router = useRouter();
  const [testimonies, setTestimonies] = useState<Testimony[]>(initialTestimonies);
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // ━━━ Filter testimonies ━━━
  const filteredTestimonies = testimonies.filter((t) => {
    if (filter === "pending") return !t.is_approved;
    if (filter === "approved") return t.is_approved && !t.is_featured;
    if (filter === "featured") return t.is_featured;
    return true; // "all"
  });

  // ━━━ Toggle approved ━━━
  const toggleApproved = async (id: string, currentIsApproved: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("testimonies")
        .update({ is_approved: !currentIsApproved })
        .eq("id", id);

      if (error) throw error;

      setTestimonies((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, is_approved: !currentIsApproved } : t
        )
      );
      toast.success(currentIsApproved ? "Removed approval" : "✅ Approved!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update testimony");
    } finally {
      setBusyId(null);
    }
  };

  // ━━━ Toggle featured ━━━
  const toggleFeatured = async (id: string, currentIsFeatured: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("testimonies")
        .update({ is_featured: !currentIsFeatured })
        .eq("id", id);

      if (error) throw error;

      setTestimonies((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, is_featured: !currentIsFeatured } : t
        )
      );
      toast.success(
        currentIsFeatured ? "Unfeatured" : "⭐ Featured on homepage!"
      );
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update testimony");
    } finally {
      setBusyId(null);
    }
  };

  // ━━━ Delete testimony ━━━
  const deleteTestimony = async (id: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;

    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("testimonies")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTestimonies((prev) => prev.filter((t) => t.id !== id));
      toast.success("Testimony deleted");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not delete testimony");
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

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: "all" as const, label: "All" },
          { value: "pending" as const, label: "Pending" },
          { value: "approved" as const, label: "Approved" },
          { value: "featured" as const, label: "Featured" },
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
      {filteredTestimonies.length === 0 && (
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
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
              />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            No testimonies here
          </h3>
          <p className="text-gray-500">
            {filter === "pending" && "All testimonies have been reviewed."}
            {filter === "approved" && "No approved testimonies yet."}
            {filter === "featured" && "No featured testimonies yet."}
            {filter === "all" && "No testimonies yet. When members share, they'll appear here."}
          </p>
        </div>
      )}

      {/* Testimonies list */}
      <div className="space-y-3">
        {filteredTestimonies.map((testimony) => {
          const isExpanded = expandedId === testimony.id;
          const isBusy = busyId === testimony.id;
          const isPending = !testimony.is_approved;
          const category = testimony.category
            ? CATEGORY_LABELS[testimony.category] || CATEGORY_LABELS.other
            : null;

          return (
            <div
              key={testimony.id}
              className={`bg-white rounded-2xl border-2 transition-all overflow-hidden ${
                isPending
                  ? "border-orange-300 shadow-md"
                  : testimony.is_featured
                  ? "border-brand-gold-400"
                  : "border-gray-100"
              } ${isExpanded ? "border-brand-gold-400 shadow-lg" : ""}`}
            >
              {/* Header (always visible) */}
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : testimony.id)
                }
                className="w-full p-5 text-left flex items-start gap-4 hover:bg-gray-50 transition-colors"
              >
                {/* Photo or Avatar */}
                {testimony.photo_url ? (
                  <div className="relative w-14 h-14 rounded-full flex-shrink-0 overflow-hidden border-2 border-white shadow-md">
                    <Image
                      src={testimony.photo_url}
                      alt={testimony.full_name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div
                    className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-lg shadow-md ${
                      testimony.is_featured
                        ? "bg-gradient-to-br from-brand-gold-400 to-brand-gold-600"
                        : isPending
                        ? "bg-gradient-to-br from-orange-500 to-orange-700"
                        : "bg-gradient-to-br from-brand-purple-500 to-brand-purple-700"
                    }`}
                  >
                    {testimony.full_name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-heading font-bold text-brand-purple-900 truncate">
                          {testimony.full_name}
                        </h3>

                        {/* Status badges */}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                            Pending
                          </span>
                        )}
                        {testimony.is_featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-gold-400 text-brand-purple-900 text-[10px] font-bold uppercase tracking-wider">
                            ⭐ Featured
                          </span>
                        )}
                        {testimony.video_url && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider">
                            📹 Video
                          </span>
                        )}
                      </div>

                      {/* Category + Location */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        {category && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${category.color}`}>
                            {category.emoji} {category.label}
                          </span>
                        )}
                        {testimony.location && (
                          <span className="text-xs text-gray-500">
                            📍 {testimony.location}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 italic">
                        &ldquo;{testimony.testimony_text}&rdquo;
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                      {formatDate(testimony.created_at)}
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
                  {/* Photo display */}
                  {testimony.photo_url && (
                    <div className="relative w-full max-w-md mx-auto aspect-video rounded-2xl overflow-hidden mb-5 border-2 border-white shadow-lg">
                      <Image
                        src={testimony.photo_url}
                        alt={testimony.full_name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Video display */}
                  {testimony.video_url && (
                    <div className="w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden mb-5 border-2 border-white shadow-lg bg-black">
                      <iframe
                        src={testimony.video_url}
                        title={`${testimony.full_name} testimony`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  )}

                  {/* Contact info */}
                  {testimony.email && (
                    <div className="bg-white rounded-xl p-4 border border-gray-100 mb-5">
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${testimony.email}`}
                        className="text-brand-purple-600 font-semibold hover:underline break-all"
                      >
                        {testimony.email}
                      </a>
                    </div>
                  )}

                  {/* Full testimony */}
                  <div className="bg-white rounded-xl p-5 border border-gray-100 mb-5">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">
                      Full Testimony
                    </p>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed italic text-base">
                      &ldquo;{testimony.testimony_text}&rdquo;
                    </p>
                    <p className="text-right text-brand-purple-600 font-bold text-sm mt-3">
                      &mdash; {testimony.full_name}
                      {testimony.location && `, ${testimony.location}`}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    {/* Approve/Unapprove */}
                    <button
                      onClick={() => toggleApproved(testimony.id, testimony.is_approved)}
                      disabled={isBusy}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-md transition-all disabled:opacity-50 ${
                        testimony.is_approved
                          ? "bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700"
                          : "bg-gradient-to-br from-brand-purple-600 to-brand-purple-700 hover:from-brand-purple-700 hover:to-brand-purple-800 text-white shadow-brand"
                      }`}
                    >
                      {testimony.is_approved ? "❌ Remove Approval" : "✅ Approve"}
                    </button>

                    {/* Feature/Unfeature (only if approved) */}
                    {testimony.is_approved && (
                      <button
                        onClick={() => toggleFeatured(testimony.id, testimony.is_featured)}
                        disabled={isBusy}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-md transition-all disabled:opacity-50 ${
                          testimony.is_featured
                            ? "bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700"
                            : "bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 hover:from-brand-gold-500 hover:to-brand-gold-600 text-brand-purple-900 shadow-gold"
                        }`}
                      >
                        {testimony.is_featured ? "☆ Unfeature" : "⭐ Feature on Homepage"}
                      </button>
                    )}

                    {/* Email Reply */}
                    {testimony.email && (
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(testimony.email)}&su=${encodeURIComponent("Thank you for sharing your testimony!")}&body=${encodeURIComponent(`Hello ${testimony.full_name},\n\nThank you for sharing your amazing testimony with The Triumphant Family Ministry! Your story is a blessing.\n\n`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        Reply via Gmail
                      </a>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => deleteTestimony(testimony.id)}
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