// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERMONS LIST (ADMIN) — Manage sermons library
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import SermonsForm from "./SermonsForm";
import LoadingScreen from "@/components/church/LoadingScreen";

interface Sermon {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  scripture: string | null;
  preacher: string | null;
  sermon_date: string;
  series: string | null;
  tags: string[] | null;
  youtube_url: string | null;
  audio_url: string | null;
  thumbnail_url: string | null;
  duration: string | null;
  views: number;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

type FilterType = "all" | "published" | "drafts" | "featured";

function getYouTubeThumbnail(url: string | null): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /youtube\.com\/live\/([^"&?\/\s]{11})/,
    /youtube\.com\/shorts\/([^"&?\/\s]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return null;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function SermonsList({
  initialSermons,
}: {
  initialSermons: Sermon[];
}) {
  const router = useRouter();
  const [sermons, setSermons] = useState<Sermon[]>(initialSermons);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading] = useState(false);

  if (loading) return <LoadingScreen message="Loading sermons..." />;

  const filteredSermons = sermons.filter((s) => {
    if (filter === "published") return s.is_published;
    if (filter === "drafts") return !s.is_published;
    if (filter === "featured") return s.is_featured;
    return true;
  });

  const togglePublished = async (id: string, current: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("sermons")
        .update({ is_published: !current })
        .eq("id", id);
      if (error) throw error;
      setSermons((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_published: !current } : s))
      );
      toast.success(current ? "Unpublished" : "✅ Published!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update");
    } finally {
      setBusyId(null);
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("sermons")
        .update({ is_featured: !current })
        .eq("id", id);
      if (error) throw error;
      setSermons((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_featured: !current } : s))
      );
      toast.success(current ? "Unfeatured" : "⭐ Featured!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update");
    } finally {
      setBusyId(null);
    }
  };

  const deleteSermon = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?\n\nThis cannot be undone.`)) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("sermons").delete().eq("id", id);
      if (error) throw error;
      setSermons((prev) => prev.filter((s) => s.id !== id));
      toast.success("🗑️ Deleted");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not delete");
    } finally {
      setBusyId(null);
    }
  };

  const handleFormSuccess = (sermon: Sermon, isEdit: boolean) => {
    if (isEdit) {
      setSermons((prev) => prev.map((s) => (s.id === sermon.id ? sermon : s)));
    } else {
      setSermons((prev) => [sermon, ...prev]);
    }
    setShowForm(false);
    setEditingSermon(null);
    router.refresh();
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {(["all", "published", "drafts", "featured"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === f
                  ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                  : "bg-white text-brand-purple-900 font-black"
              }`}
            >
              {f === "all" && "📚 All"}
              {f === "published" && "✅ Published"}
              {f === "drafts" && "📝 Drafts"}
              {f === "featured" && "⭐ Featured"}
            </button>
          ))}
        </div>

        {/* Add button */}
        <button
          onClick={() => { setEditingSermon(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New Sermon
        </button>
      </div>

      {/* Empty state */}
      {filteredSermons.length === 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-10 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">🎬</div>
          <h3 className="font-heading text-2xl font-bold text-white mb-2">
            No sermons yet
          </h3>
          <p className="text-brand-purple-200 font-semibold mb-6">
            {filter === "all" ? "Start by adding your first sermon!" : `No ${filter} sermons found.`}
          </p>
          {filter === "all" && (
            <button
              onClick={() => { setEditingSermon(null); setShowForm(true); }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all"
            >
              🎬 Add Your First Sermon
            </button>
          )}
        </div>
      )}

      {/* Sermons grid */}
      {filteredSermons.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSermons.map((sermon) => {
            const thumbnail = sermon.thumbnail_url || getYouTubeThumbnail(sermon.youtube_url);
            const isBusy = busyId === sermon.id;

            return (
              <div
                key={sermon.id}
                className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                {/* Thumbnail */}
                <div className="relative aspect-video">
                  {thumbnail ? (
                    <img src={thumbnail} alt={sermon.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-purple-950/60">
                      <svg className="w-12 h-12 text-brand-gold-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {sermon.is_featured && (
                      <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 text-xs font-black shadow-md">
                        ⭐ Featured
                      </span>
                    )}
                    {!sermon.is_published && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-purple-950/80 text-white text-xs font-black shadow-md border border-brand-gold-400/40">
                        📝 Draft
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-heading font-black text-white mb-2 line-clamp-2">
                    {sermon.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-brand-purple-200 font-semibold mb-4">
                    <span>{formatDate(sermon.sermon_date)}</span>
                    {sermon.views > 0 && <span>👁️ {sermon.views}</span>}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 pt-3 border-t border-brand-gold-400/30">
                    <button
                      onClick={() => { setEditingSermon(sermon); setShowForm(true); }}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-full bg-white text-brand-purple-900 text-xs font-black transition-all"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => togglePublished(sermon.id, sermon.is_published)}
                      disabled={isBusy}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-full bg-brand-purple-950/60 text-white border border-brand-gold-400/40 text-xs font-black transition-all disabled:opacity-50"
                    >
                      {sermon.is_published ? "🙈 Hide" : "👁️ Show"}
                    </button>
                    <button
                      onClick={() => toggleFeatured(sermon.id, sermon.is_featured)}
                      disabled={isBusy}
                      className={`inline-flex items-center justify-center px-2 py-1.5 rounded-full text-xs font-black transition-all disabled:opacity-50 ${
                        sermon.is_featured
                          ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900"
                          : "bg-brand-purple-950/60 text-white border border-brand-gold-400/40"
                      }`}
                    >
                      ⭐
                    </button>
                    <button
                      onClick={() => deleteSermon(sermon.id, sermon.title)}
                      disabled={isBusy}
                      className="inline-flex items-center justify-center px-2 py-1.5 rounded-full bg-red-600 text-white text-xs font-black transition-all disabled:opacity-50"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <SermonsForm
          sermon={editingSermon}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowForm(false); setEditingSermon(null); }}
        />
      )}
    </div>
  );
}