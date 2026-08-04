// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TESTIMONIES LIST — Interactive testimony management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

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

export default function TestimoniesList({ initialTestimonies }: { initialTestimonies: Testimony[] }) {
  const router = useRouter();
  const [testimonies, setTestimonies] = useState<Testimony[]>(initialTestimonies);
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading] = useState(false);

  if (loading) return <LoadingScreen message="Loading testimonies..." />;

  const filteredTestimonies = testimonies.filter((t) => {
    if (filter === "pending") return !t.is_approved;
    if (filter === "approved") return t.is_approved && !t.is_featured;
    if (filter === "featured") return t.is_featured;
    return true;
  });

  const toggleApproved = async (id: string, currentIsApproved: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("testimonies").update({ is_approved: !currentIsApproved }).eq("id", id);
      if (error) throw error;
      setTestimonies((prev) => prev.map((t) => t.id === id ? { ...t, is_approved: !currentIsApproved } : t));
      toast.success(currentIsApproved ? "Removed approval" : "✅ Approved!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update testimony");
    } finally {
      setBusyId(null);
    }
  };

  const toggleFeatured = async (id: string, currentIsFeatured: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("testimonies").update({ is_featured: !currentIsFeatured }).eq("id", id);
      if (error) throw error;
      setTestimonies((prev) => prev.map((t) => t.id === id ? { ...t, is_featured: !currentIsFeatured } : t));
      toast.success(currentIsFeatured ? "Unfeatured" : "⭐ Featured on homepage!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update testimony");
    } finally {
      setBusyId(null);
    }
  };

  const deleteTestimony = async (id: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("testimonies").delete().eq("id", id);
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
                ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                : "bg-white text-brand-purple-900 font-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredTestimonies.length === 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-12 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">✨</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">No testimonies here</h3>
          <p className="text-brand-purple-200 font-semibold">
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
          const category = testimony.category ? CATEGORY_LABELS[testimony.category] || CATEGORY_LABELS.other : null;

          return (
            <div
              key={testimony.id}
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 transition-all ${
                isExpanded ? "border-brand-gold-400 shadow-2xl" : "border-brand-gold-400/40 shadow-xl"
              }`}
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : testimony.id)}
                className="w-full p-5 text-left flex items-start gap-4 hover:bg-brand-purple-950/30 transition-colors"
              >
                {/* Photo or Avatar */}
                {testimony.photo_url ? (
                  <div className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden border-2 border-brand-gold-400/40 shadow-md">
                    <img src={testimony.photo_url} alt={testimony.full_name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center font-black text-brand-purple-900 text-lg shadow-md ${
                    testimony.is_featured ? "bg-gradient-to-br from-brand-gold-400 to-brand-gold-500" : "bg-white"
                  }`}>
                    {testimony.full_name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-heading font-black text-white truncate">{testimony.full_name}</h3>
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-wider">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                            Pending
                          </span>
                        )}
                        {testimony.is_featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 text-[10px] font-black uppercase tracking-wider">
                            ⭐ Featured
                          </span>
                        )}
                        {testimony.video_url && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-wider">
                            🎥 Video
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        {category && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black bg-brand-purple-950/60 text-white border border-brand-gold-400/40">
                            {category.emoji} {category.label}
                          </span>
                        )}
                        {testimony.location && (
                          <span className="text-xs text-brand-purple-200 font-semibold">📍 {testimony.location}</span>
                        )}
                      </div>
                      <p className="text-sm text-brand-purple-200 font-semibold line-clamp-2 italic">
                        &ldquo;{testimony.testimony_text}&rdquo;
                      </p>
                    </div>
                    <span className="text-xs text-brand-purple-300 font-semibold whitespace-nowrap">{formatDate(testimony.created_at)}</span>
                  </div>
                </div>

                <svg className={`w-5 h-5 text-brand-gold-400 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded */}
              {isExpanded && (
                <div className="border-t border-brand-gold-400/30 p-5">
                  {/* Photo */}
                  {testimony.photo_url && (
                    <div className="w-full max-w-md mx-auto aspect-video rounded-2xl overflow-hidden mb-5 border-2 border-brand-gold-400/40 shadow-lg">
                      <img src={testimony.photo_url} alt={testimony.full_name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}

                  {/* Video */}
                  {testimony.video_url && (
                    <div className="w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden mb-5 border-2 border-brand-gold-400/40 shadow-lg bg-black">
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
                    <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30 mb-5">
                      <p className="text-xs text-brand-purple-200 uppercase tracking-widest font-semibold mb-1">Email</p>
                      <a href={`mailto:${testimony.email}`} className="text-brand-gold-400 font-semibold hover:underline break-all">{testimony.email}</a>
                    </div>
                  )}

                  {/* Full testimony */}
                  <div className="bg-brand-purple-950/60 rounded-xl p-5 border border-brand-gold-400/30 mb-5">
                    <p className="text-xs text-brand-purple-200 uppercase tracking-widest font-semibold mb-2">Full Testimony</p>
                    <p className="text-white font-semibold whitespace-pre-line leading-relaxed italic text-base">
                      &ldquo;{testimony.testimony_text}&rdquo;
                    </p>
                    <p className="text-right text-brand-gold-400 font-black text-sm mt-3">
                      — {testimony.full_name}{testimony.location && `, ${testimony.location}`}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleApproved(testimony.id, testimony.is_approved)}
                      disabled={isBusy}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-black transition-all disabled:opacity-50 ${
                        testimony.is_approved
                          ? "bg-white text-brand-purple-900"
                          : "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                      }`}
                    >
                      {testimony.is_approved ? "❌ Remove Approval" : "✅ Approve"}
                    </button>
                    {testimony.is_approved && (
                      <button
                        onClick={() => toggleFeatured(testimony.id, testimony.is_featured)}
                        disabled={isBusy}
                        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-black transition-all disabled:opacity-50 ${
                          testimony.is_featured
                            ? "bg-white text-brand-purple-900"
                            : "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                        }`}
                      >
                        {testimony.is_featured ? "☆ Unfeature" : "⭐ Feature on Homepage"}
                      </button>
                    )}
                    {testimony.email && (
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(testimony.email)}&su=${encodeURIComponent("Thank you for sharing your testimony!")}&body=${encodeURIComponent(`Hello ${testimony.full_name},\n\nThank you for sharing your amazing testimony with The Triumphant Family Ministry! Your story is a blessing.\n\n`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white text-brand-purple-900 text-sm font-black transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        Reply via Gmail
                      </a>
                    )}
                    <button
                      onClick={() => deleteTestimony(testimony.id)}
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