// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GALLERY LIST — Interactive gallery management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import GalleryForm from "./GalleryForm";

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

const CATEGORY_COLORS: Record<string, string> = {
  worship: "bg-purple-100 text-purple-700 border-purple-200",
  prayer: "bg-blue-100 text-blue-700 border-blue-200",
  event: "bg-orange-100 text-orange-700 border-orange-200",
  ministry: "bg-green-100 text-green-700 border-green-200",
  outreach: "bg-pink-100 text-pink-700 border-pink-200",
  service: "bg-indigo-100 text-indigo-700 border-indigo-200",
  general: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function GalleryList({
  initialItems,
}: {
  initialItems: GalleryItem[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // ━━━ Filter items ━━━
  const filteredItems = items.filter((item) => {
    if (filter === "published") return item.is_published;
    if (filter === "drafts") return !item.is_published;
    return true;
  });

  // ━━━ Toggle published ━━━
  const togglePublished = async (id: string, currentIsPublished: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("gallery")
        .update({ is_published: !currentIsPublished })
        .eq("id", id);

      if (error) throw error;

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_published: !currentIsPublished } : item
        )
      );
      toast.success(currentIsPublished ? "Unpublished" : "✅ Published!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update");
    } finally {
      setBusyId(null);
    }
  };

  // ━━━ Delete item ━━━
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

  // ━━━ Handle form success ━━━
  const handleFormSuccess = (
    savedItem: GalleryItem,
    isEdit: boolean
  ) => {
    if (isEdit) {
      setItems((prev) =>
        prev.map((item) => (item.id === savedItem.id ? savedItem : item))
      );
    } else {
      setItems((prev) =>
        [...prev, savedItem].sort((a, b) => a.display_order - b.display_order)
      );
    }
    setShowForm(false);
    setEditingItem(null);
    router.refresh();
  };

  return (
    <div>
      {/* Actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Filter tabs */}
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
                  ? "bg-gradient-to-br from-brand-purple-600 to-brand-purple-700 text-white shadow-brand"
                  : "bg-white text-gray-600 border-2 border-gray-200 hover:border-brand-purple-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Add button */}
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 hover:from-brand-gold-500 hover:to-brand-gold-600 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
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
          Add Photo
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <GalleryForm
          item={editingItem}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Empty state */}
      {filteredItems.length === 0 && !showForm && (
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
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            {filter === "all" && "No photos yet"}
            {filter === "published" && "No published photos"}
            {filter === "drafts" && "No draft photos"}
          </h3>
          <p className="text-gray-500 mb-4">
            {filter === "all" && "Add your first ministry photo to get started"}
            {filter === "published" &&
              "Publish some photos to display them publicly"}
            {filter === "drafts" && "All photos are published"}
          </p>
          {filter === "all" && (
            <button
              onClick={() => {
                setEditingItem(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-bold transition-all"
            >
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
            const categoryColor = item.category
              ? CATEGORY_COLORS[item.category] || CATEGORY_COLORS.general
              : null;

            return (
              <div
                key={item.id}
                className={`group relative bg-white rounded-2xl overflow-hidden border-2 transition-all shadow-md hover:shadow-xl ${
                  item.is_published
                    ? "border-gray-100 hover:border-brand-gold-400"
                    : "border-gray-200 opacity-60"
                }`}
              >
                {/* Order badge */}
                <div className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-brand-purple-900/80 text-white text-xs font-bold flex items-center justify-center backdrop-blur-sm">
                  #{item.display_order}
                </div>

                {/* Status badge */}
                <div className="absolute top-2 right-2 z-10">
                  {item.is_published ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider">
                      Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-500 text-white text-[10px] font-bold uppercase tracking-wider">
                      Draft
                    </span>
                  )}
                </div>

                {/* Image */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.title || "Gallery"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />

                  {/* Category badge */}
                  {item.category && categoryColor && (
                    <div className="absolute bottom-2 left-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${categoryColor}`}
                      >
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  {item.title && (
                    <h3 className="font-heading font-bold text-brand-purple-900 text-sm truncate mb-1">
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p className="text-gray-500 text-xs line-clamp-2 mb-3">
                      {item.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-1.5 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setShowForm(true);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-xs font-bold transition-all"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => togglePublished(item.id, item.is_published)}
                      disabled={isBusy}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {item.is_published ? "🙈" : "👁️"}
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
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