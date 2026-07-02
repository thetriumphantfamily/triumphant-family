// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERMONS FORM — Modal for adding/editing sermons
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

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

interface SermonsFormProps {
  sermon: Sermon | null;
  onSuccess: (sermon: Sermon, isEdit: boolean) => void;
  onCancel: () => void;
}

// Generate slug from title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function SermonsForm({
  sermon,
  onSuccess,
  onCancel,
}: SermonsFormProps) {
  const isEdit = sermon !== null;

  const [formData, setFormData] = useState({
    title: sermon?.title || "",
    slug: sermon?.slug || "",
    description: sermon?.description || "",
    scripture: sermon?.scripture || "",
    preacher: sermon?.preacher || "Prophet Olayiwole Ogunsola",
    sermon_date: sermon?.sermon_date?.split("T")[0] || new Date().toISOString().split("T")[0],
    tag: sermon?.tag || "",
    youtube_url: sermon?.youtube_url || "",
    audio_url: sermon?.audio_url || "",
    thumbnail_url: sermon?.thumbnail_url || "",
    duration: sermon?.duration || "",
    is_featured: sermon?.is_featured ?? false,
    is_published: sermon?.is_published ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      // Auto-generate slug only when adding new (not editing)
      slug: isEdit ? formData.slug : slugify(title),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || null,
        scripture: formData.scripture.trim() || null,
        preacher: formData.preacher.trim() || null,
        sermon_date: formData.sermon_date,
        tag: formData.tag.trim() || null,
        youtube_url: formData.youtube_url.trim() || null,
        audio_url: formData.audio_url.trim() || null,
        thumbnail_url: formData.thumbnail_url.trim() || null,
        duration: formData.duration.trim() || null,
        is_featured: formData.is_featured,
        is_published: formData.is_published,
      };

      let result;
      if (isEdit && sermon) {
        result = await supabase
          .from("sermons")
          .update(payload)
          .eq("id", sermon.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("sermons")
          .insert(payload)
          .select()
          .single();
      }

      if (result.error) {
        console.error("Supabase error:", result.error);
        toast.error(`Error: ${result.error.message}`);
        return;
      }

      toast.success(isEdit ? "✅ Sermon updated!" : "🎉 Sermon added!", {
        style: {
          background: "#6B1F8A",
          color: "#fff",
          border: "1px solid #FFC72C",
        },
      });

      onSuccess(result.data as Sermon, isEdit);
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
      <div onClick={onCancel} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 p-6 z-10 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-brand-purple-900">
                  {isEdit ? "✏️ Edit Sermon" : "🎬 Add New Sermon"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {isEdit ? `Updating "${sermon?.title}"` : "Add a new sermon to the library"}
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
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                Sermon Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="The Power of Prayer"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="the-power-of-prayer"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                URL: /sermons/{formData.slug || "slug-here"}
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What is this sermon about?"
                rows={4}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
              />
            </div>

            {/* Scripture + Preacher */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                  Scripture Reference
                </label>
                <input
                  type="text"
                  value={formData.scripture}
                  onChange={(e) => setFormData({ ...formData, scripture: e.target.value })}
                  placeholder="Matthew 6:9-13"
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                  Preacher
                </label>
                <input
                  type="text"
                  value={formData.preacher}
                  onChange={(e) => setFormData({ ...formData, preacher: e.target.value })}
                  placeholder="Prophet Olayiwole Ogunsola"
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Date + Duration + Tag */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                  Sermon Date
                </label>
                <input
                  type="date"
                  value={formData.sermon_date}
                  onChange={(e) => setFormData({ ...formData, sermon_date: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="45:30"
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                  Tag / Series
                </label>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  placeholder="Prayer Series"
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                />
              </div>
            </div>

            {/* YouTube URL */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">
                🎬 Thumbnail auto-extracted from YouTube
              </p>
            </div>

            {/* Custom Thumbnail (optional) */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                Custom Thumbnail URL (Optional)
              </label>
              <input
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder="https://... (overrides YouTube thumbnail)"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
              />
            </div>

            {/* Audio URL (optional) */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                Audio URL (Optional)
              </label>
              <input
                type="url"
                value={formData.audio_url}
                onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                placeholder="https://... (MP3 audio link)"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                  Publish Status
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}
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
                  <span className={`font-bold text-sm ${formData.is_published ? "text-green-600" : "text-gray-500"}`}>
                    {formData.is_published ? "✅ Published" : "📝 Draft"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                  Featured Sermon
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                      formData.is_featured ? "bg-brand-gold-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                        formData.is_featured ? "translate-x-9" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className={`font-bold text-sm ${formData.is_featured ? "text-brand-gold-600" : "text-gray-500"}`}>
                    {formData.is_featured ? "⭐ Featured" : "Not featured"}
                  </span>
                </div>
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
                  <>{isEdit ? "💾 Update Sermon" : "🎉 Add Sermon"}</>
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