// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GALLERY FORM — Modal form for adding/editing gallery photos
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

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

interface GalleryFormProps {
  item: GalleryItem | null;
  onSuccess: (item: GalleryItem, isEdit: boolean) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  { value: "worship", label: "🎵 Worship" },
  { value: "prayer", label: "🙏 Prayer" },
  { value: "event", label: "📅 Event" },
  { value: "ministry", label: "⛪ Ministry" },
  { value: "outreach", label: "🌍 Outreach" },
  { value: "service", label: "✝️ Service" },
  { value: "general", label: "📸 General" },
];

export default function GalleryForm({
  item,
  onSuccess,
  onCancel,
}: GalleryFormProps) {
  const isEdit = item !== null;

  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    image_url: item?.image_url || "",
    category: item?.category || "general",
    display_order: item?.display_order || 0,
    is_published: item?.is_published ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.image_url.trim()) {
      toast.error("Image URL is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const payload = {
        title: formData.title.trim() || null,
        description: formData.description.trim() || null,
        image_url: formData.image_url.trim(),
        category: formData.category || null,
        display_order: Number(formData.display_order) || 0,
        is_published: formData.is_published,
      };

      let result;
      if (isEdit && item) {
        result = await supabase
          .from("gallery")
          .update(payload)
          .eq("id", item.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("gallery")
          .insert(payload)
          .select()
          .single();
      }

      if (result.error) {
        console.error("Supabase error:", result.error);
        toast.error(`Error: ${result.error.message}`);
        return;
      }

      toast.success(isEdit ? "✅ Photo updated!" : "🎉 Photo added!", {
        style: {
          background: "#6B1F8A",
          color: "#fff",
          border: "1px solid #FFC72C",
        },
      });

      onSuccess(result.data as GalleryItem, isEdit);
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 p-6 z-10 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-brand-purple-900">
                  {isEdit ? "✏️ Edit Photo" : "📸 Add New Photo"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {isEdit ? "Update photo details" : "Add a new photo to the gallery"}
                </p>
              </div>
              <button
                onClick={onCancel}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Image URL */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => {
                  setFormData({ ...formData, image_url: e.target.value });
                  setImagePreviewError(false);
                }}
                placeholder="https://... (link to image)"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                📸 Upload to Imgur/Google Drive/Cloudinary, then paste link
              </p>
            </div>

            {/* Image Preview */}
            {formData.image_url && !imagePreviewError && (
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-brand-purple-200 bg-gray-100">
                <Image
                  src={formData.image_url}
                  alt="Preview"
                  fill
                  className="object-contain"
                  unoptimized
                  onError={() => setImagePreviewError(true)}
                />
              </div>
            )}

            {imagePreviewError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
                <p className="text-red-700 text-sm">
                  ⚠️ Could not load image. Check the URL.
                </p>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Sunday Service - Worship Moments"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description..."
                rows={3}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
              />
            </div>

            {/* Category + Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                  min={0}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Published toggle */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                Status
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      is_published: !formData.is_published,
                    })
                  }
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                    formData.is_published ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                      formData.is_published ? "translate-x-9" : "translate-x-1"
                    }`}
                  />
                </button>
                <span
                  className={`font-bold text-sm ${
                    formData.is_published ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {formData.is_published ? "✅ Published" : "📝 Draft"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 hover:from-brand-gold-500 hover:to-brand-gold-600 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-brand-purple-900/30 border-t-brand-purple-900 rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{isEdit ? "💾 Update Photo" : "🎉 Add Photo"}</>
                )}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}