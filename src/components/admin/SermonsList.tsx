// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERMONS LIST (ADMIN) — Manage sermons library
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import SermonsForm from "./SermonsForm";

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

// Extract YouTube thumbnail from URL
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

// Format date nicely
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

  // Filter sermons
  const filteredSermons = sermons.filter((s) => {
    if (filter === "published") return s.is_published;
    if (filter === "drafts") return !s.is_published;
    if (filter === "featured") return s.is_featured;
    return true;
  });

  // Toggle published
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

  // Toggle featured
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

  // Delete sermon
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

  // Handle form success (add or edit)
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
                  ? "bg-brand-purple-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
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
          onClick={() => {
            setEditingSermon(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add New Sermon
        </button>
      </div>

      {/* Empty state */}
      {filteredSermons.length === 0 && (
        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md p-10 text-center">
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
                d="M15.75 5.25v13.5m-7.5-13.5v13.5"
              />
            </svg>
          </div>
          <h3 className="font-heading text-2xl font-bold text-brand-purple-900 mb-2">
            No sermons yet
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === "all"
              ? "Start by adding your first sermon!"
              : `No ${filter} sermons found.`}
          </p>
          {filter === "all" && (
            <button
              onClick={() => {
                setEditingSermon(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all"
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
                className="bg-white rounded-2xl border-2 border-gray-100 shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-100">
                  {thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnail}
                      alt={sermon.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-purple-100 to-brand-purple-200">
                      <svg
                        className="w-12 h-12 text-brand-purple-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {sermon.is_featured && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-gold-400 text-brand-purple-900 text-xs font-bold shadow-md">
                        ⭐ Featured
                      </span>
                    )}
                    {!sermon.is_published && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-600 text-white text-xs font-bold shadow-md">
                        📝 Draft
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="font-heading font-bold text-brand-purple-900 mb-2 line-clamp-2">
                    {sermon.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span>{formatDate(sermon.sermon_date)}</span>
                    {sermon.views > 0 && <span>👁️ {sermon.views}</span>}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setEditingSermon(sermon);
                        setShowForm(true);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-xs font-bold transition-all"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => togglePublished(sermon.id, sermon.is_published)}
                      disabled={isBusy}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {sermon.is_published ? "🙈 Hide" : "👁️ Show"}
                    </button>
                    <button
                      onClick={() => toggleFeatured(sermon.id, sermon.is_featured)}
                      disabled={isBusy}
                      className={`inline-flex items-center justify-center px-2 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-50 ${
                        sermon.is_featured
                          ? "bg-brand-gold-100 border-2 border-brand-gold-300 text-brand-gold-700"
                          : "bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-500"
                      }`}
                    >
                      ⭐
                    </button>
                    <button
                      onClick={() => deleteSermon(sermon.id, sermon.title)}
                      disabled={isBusy}
                      className="inline-flex items-center justify-center px-2 py-1.5 rounded-full bg-white hover:bg-red-50 border-2 border-red-200 text-red-600 text-xs font-bold transition-all disabled:opacity-50"
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
          onCancel={() => {
            setShowForm(false);
            setEditingSermon(null);
          }}
        />
      )}
    </div>
  );
}