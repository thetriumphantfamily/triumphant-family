// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERMONS LIST — Interactive sermon management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  tag: string | null;
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
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (!match) return null;
  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
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

  // Delete
  const deleteSermon = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("sermons").delete().eq("id", id);
      if (error) throw error;

      setSermons((prev) => prev.filter((s) => s.id !== id));
      toast.success("Sermon deleted");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not delete");
    } finally {
      setBusyId(null);
    }
  };

  // Form success handler
  const handleFormSuccess = (saved: Sermon, isEdit: boolean) => {
    if (isEdit) {
      setSermons((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
    } else {
      setSermons((prev) => [saved, ...prev]);
    }
    setShowForm(false);
    setEditingSermon(null);
    router.refresh();
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all" as const, label: "All" },
            { value: "published" as const, label: "Published" },
            { value: "drafts" as const, label: "Drafts" },
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

        <button
          onClick={() => {
            setEditingSermon(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 hover:from-brand-gold-500 hover:to-brand-gold-600 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Sermon
        </button>
      </div>

      {/* Form modal */}
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

      {/* Empty state */}
      {filteredSermons.length === 0 && !showForm && (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-purple-100 mb-4">
            <svg className="w-10 h-10 text-brand-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            {filter === "all" ? "No sermons yet" : `No ${filter} sermons`}
          </h3>
          <p className="text-gray-500 mb-4">
            {filter === "all" && "Add your first sermon to build the library"}
            {filter === "published" && "Publish some sermons to display them"}
            {filter === "drafts" && "All sermons are published"}
            {filter === "featured" && "Feature sermons to highlight them"}
          </p>
          {filter === "all" && (
            <button
              onClick={() => {
                setEditingSermon(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-bold transition-all"
            >
              + Add First Sermon
            </button>
          )}
        </div>
      )}

      {/* Sermons grid */}
      {filteredSermons.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSermons.map((sermon) => {
            const isBusy = busyId === sermon.id;
            const thumbnail = sermon.thumbnail_url || getYouTubeThumbnail(sermon.youtube_url);

            return (
              <div
                key={sermon.id}
                className={`relative bg-white rounded-2xl overflow-hidden border-2 transition-all shadow-md hover:shadow-xl ${
                  sermon.is_published
                    ? "border-gray-100 hover:border-brand-gold-400"
                    : "border-gray-200 opacity-70"
                } ${sermon.is_featured ? "ring-2 ring-brand-gold-400" : ""}`}
              >
                {/* Featured badge */}
                {sermon.is_featured && (
                  <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-gold-400 text-brand-purple-900 text-xs font-bold shadow-md">
                    ⭐ Featured
                  </div>
                )}

                {/* Status badge */}
                <div className="absolute top-3 right-3 z-10">
                  {sermon.is_published ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider">
                      Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-500 text-white text-[10px] font-bold uppercase tracking-wider">
                      Draft
                    </span>
                  )}
                </div>

                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-brand-violet-900 to-brand-purple-900 overflow-hidden">
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={sermon.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-white/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                  )}

                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-2xl">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Duration */}
                  {sermon.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 text-white text-xs font-bold">
                      {sermon.duration}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  {sermon.tag && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-brand-purple-50 text-brand-purple-700 text-xs font-bold mb-2">
                      {sermon.tag}
                    </span>
                  )}

                  <h3 className="font-heading font-bold text-brand-purple-900 mb-1 line-clamp-2">
                    {sermon.title}
                  </h3>

                  {sermon.scripture && (
                    <p className="text-brand-gold-600 text-xs font-semibold italic mb-2">
                      📖 {sermon.scripture}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    {sermon.preacher && <span>👤 {sermon.preacher}</span>}
                    <span>📅 {formatDate(sermon.sermon_date)}</span>
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
                      {sermon.is_published ? "🙈" : "👁️"}
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
                      className="inline-flex items-center justify-center px-2 py-1.5 rounded-full bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 text-xs font-bold transition-all disabled:opacity-50"
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
    </div>
  );
}