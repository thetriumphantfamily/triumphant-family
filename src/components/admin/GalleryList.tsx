// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GALLERY LIST — Interactive gallery management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import GalleryForm from "./GalleryForm";
import LoadingScreen from "@/components/church/LoadingScreen";

interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  category: string | null;
  event_id: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

type FilterType = "all" | "published" | "drafts";

export default function GalleryList({ initialItems }: { initialItems: GalleryItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading] = useState(false);

  if (loading) return <LoadingScreen message="Loading gallery..." />;

  const filteredItems = items.filter((item) => {
    if (filter === "published") return item.is_published;
    if (filter === "drafts") return !item.is_published;
    return true;
  });

  const togglePublished = async (id: string, currentIsPublished: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("gallery").update({ is_published: !currentIsPublished }).eq("id", id);
      if (error) throw error;
      setItems((prev) => prev.map((item) => item.id === id ? { ...item, is_published: !currentIsPublished } : item));
      toast.success(currentIsPublished ? "Unpublished" : "✅ Published!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update");
    } finally {
      setBusyId(null);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this photo? This cannot be undone.")) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Photo deleted");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not delete");
    } finally {
      setBusyId(null);
    }
  };

  const handleFormSuccess = (savedItem: GalleryItem, isEdit: boolean) => {
    if (isEdit) {
      setItems((prev) => prev.map((item) => item.id === savedItem.id ? savedItem : item));
    } else {
      setItems((prev) => [...prev, savedItem].sort((a, b) => a.display_order - b.display_order));
    }
    setShowForm(false);
    setEditingItem(null);
    router.refresh();
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
        <button
          onClick={() => { setEditingItem(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Photo
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <GalleryForm
          item={editingItem}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowForm(false); setEditingItem(null); }}
        />
      )}

      {/* Empty state */}
      {filteredItems.length === 0 && !showForm && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-12 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">🖼️</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">
            {filter === "all" ? "No photos yet" : filter === "published" ? "No published photos" : "No draft photos"}
          </h3>
          <p className="text-brand-purple-200 font-semibold mb-4">
            {filter === "all" ? "Add your first ministry photo to get started" : filter === "published" ? "Publish some photos to display them publicly" : "All photos are published"}
          </p>
          {filter === "all" && (
            <button onClick={() => { setEditingItem(null); setShowForm(true); }} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all">
              + Add First Photo
            </button>
          )}
        </div>
      )}

      {/* Gallery grid */}
      {filteredItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isBusy = busyId === item.id;
            return (
              <div
                key={item.id}
                className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-xl transition-all hover:-translate-y-1 ${!item.is_published ? "opacity-60" : ""}`}
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                {/* Order badge */}
                <div className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-brand-purple-950/80 text-white text-xs font-black flex items-center justify-center border border-brand-gold-400/40">
                  #{item.display_order}
                </div>

                {/* Status badge */}
                <div className="absolute top-2 right-2 z-10">
                  {item.is_published ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-black uppercase tracking-wider">Live</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-purple-950/80 text-white text-[10px] font-black uppercase tracking-wider border border-brand-gold-400/40">Draft</span>
                  )}
                </div>

                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img src={item.image_url} alt={item.title || "Gallery"} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                  {item.category && (
                    <div className="absolute bottom-2 left-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black bg-brand-purple-950/80 text-white border border-brand-gold-400/40">
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  {item.title && (
                    <h3 className="font-heading font-black text-white text-sm truncate mb-1">{item.title}</h3>
                  )}
                  {item.description && (
                    <p className="text-brand-purple-200 font-semibold text-xs line-clamp-2 mb-3">{item.description}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-1.5 pt-2 border-t border-brand-gold-400/30">
                    <button
                      onClick={() => { setEditingItem(item); setShowForm(true); }}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-full bg-white text-brand-purple-900 text-xs font-black transition-all"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => togglePublished(item.id, item.is_published)}
                      disabled={isBusy}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-full bg-brand-purple-950/60 text-white border border-brand-gold-400/40 text-xs font-black transition-all disabled:opacity-50"
                    >
                      {item.is_published ? "🙈" : "👁️"}
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
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
    </div>
  );
}