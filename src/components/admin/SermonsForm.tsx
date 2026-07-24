// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERMONS FORM — Super simple: just paste YouTube URL and save
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

interface SermonsFormProps {
  sermon: Sermon | null;
  onSuccess: (sermon: Sermon, isEdit: boolean) => void;
  onCancel: () => void;
}

// ━━━ Generate URL slug from title ━━━
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") +
    "-" +
    Date.now().toString().slice(-6); // Add timestamp for uniqueness
}

// ━━━ Extract YouTube video ID from ANY URL format ━━━
function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /youtube\.com\/live\/([^"&?\/\s]{11})/,
    /youtube\.com\/shorts\/([^"&?\/\s]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

// ━━━ Get YouTube thumbnail URL ━━━
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export default function SermonsForm({
  sermon,
  onSuccess,
  onCancel,
}: SermonsFormProps) {
  const isEdit = sermon !== null;

  const [formData, setFormData] = useState({
    title: sermon?.title || "",
    youtube_url: sermon?.youtube_url || "",
    sermon_date:
      sermon?.sermon_date?.split("T")[0] ||
      new Date().toISOString().split("T")[0],
    description: sermon?.description || "",
    is_featured: sermon?.is_featured ?? false,
    is_published: sermon?.is_published ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-detect YouTube video ID and thumbnail
  const youtubeId = extractYouTubeId(formData.youtube_url);
  const thumbnail = youtubeId ? getYouTubeThumbnail(youtubeId) : null;

  // ━━━ Reset form for adding another ━━━
  const resetForm = () => {
    setFormData({
      title: "",
      youtube_url: "",
      sermon_date: new Date().toISOString().split("T")[0],
      description: "",
      is_featured: false,
      is_published: true,
    });
  };

  // ━━━ Save sermon (with option to add another) ━━━
  const saveSermon = async (addAnother: boolean = false) => {
    if (!formData.title.trim()) {
      toast.error("Sermon title is required");
      return;
    }

    if (!formData.youtube_url.trim()) {
      toast.error("YouTube URL is required");
      return;
    }

    if (!youtubeId) {
      toast.error("Invalid YouTube URL. Please check the link.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const payload = {
        title: formData.title.trim(),
        slug: isEdit && sermon ? sermon.slug : slugify(formData.title),
        description: formData.description.trim() || null,
        preacher: "Prophet Olayiwole Ogunsola",
        sermon_date: formData.sermon_date,
        youtube_url: formData.youtube_url.trim(),
        thumbnail_url: thumbnail,
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
        setIsSubmitting(false);
        return;
      }

      toast.success(
        isEdit ? "✅ Sermon updated!" : "🎉 Sermon added!",
        {
          style: {
            background: "#6B1F8A",
            color: "#fff",
            border: "1px solid #FFC72C",
          },
        }
      );

      if (addAnother && !isEdit) {
        // Reset form for another sermon
        resetForm();
        setIsSubmitting(false);
      } else {
        // Close form
        onSuccess(result.data as Sermon, isEdit);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    saveSermon(false);
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
          {/* ━━━ HEADER ━━━ */}
          <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-brand-purple-900">
                  {isEdit ? "✏️ Edit Sermon" : "🎬 Add New Sermon"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {isEdit
                    ? `Updating "${sermon?.title}"`
                    : "Just paste a YouTube link and save!"}
                </p>
              </div>
              <button
                onClick={onCancel}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* ━━━ FORM ━━━ */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* SERMON TITLE */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                📝 Sermon Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. The Power of Prayer"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                required
              />
            </div>

            {/* YOUTUBE URL */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                📺 YouTube URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.youtube_url}
                onChange={(e) =>
                  setFormData({ ...formData, youtube_url: e.target.value })
                }
                placeholder="Paste any YouTube link here..."
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                ✨ Accepts: youtube.com/watch, youtu.be, /embed/, /live/, /shorts/
              </p>

              {/* Live thumbnail preview */}
              {thumbnail && (
                <div className="mt-3 p-3 bg-green-50 rounded-xl border-2 border-green-200">
                  <p className="text-xs font-bold text-green-800 mb-2">
                    ✅ YouTube video detected! Preview:
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnail}
                    alt="Sermon thumbnail"
                    className="w-full max-w-sm rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* SERMON DATE */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                📅 Sermon Date
              </label>
              <input
                type="date"
                value={formData.sermon_date}
                onChange={(e) =>
                  setFormData({ ...formData, sermon_date: e.target.value })
                }
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                ✍️ Short Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="What is this sermon about? (optional)"
                rows={3}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
              />
            </div>

            {/* PUBLISHING TOGGLES */}
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-100 space-y-3">
              {/* Published toggle */}
              <div className="flex items-center justify-between bg-white p-3 rounded-xl">
                <div>
                  <p className="font-bold text-brand-purple-900 text-sm">
                    ✅ Publish to Website
                  </p>
                  <p className="text-xs text-gray-500">
                    Make visible on the sermons page
                  </p>
                </div>
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
              </div>

              {/* Featured toggle */}
              <div className="flex items-center justify-between bg-white p-3 rounded-xl">
                <div>
                  <p className="font-bold text-brand-purple-900 text-sm">
                    ⭐ Featured Sermon
                  </p>
                  <p className="text-xs text-gray-500">
                    Show at the top of the sermons page
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      is_featured: !formData.is_featured,
                    })
                  }
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
              </div>
            </div>

            {/* ━━━ ACTION BUTTONS ━━━ */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-gray-100">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all"
              >
                Cancel
              </button>

              {/* Save & Add Another (only when adding new) */}
              {!isEdit && (
                <button
                  type="button"
                  onClick={() => saveSermon(true)}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 rounded-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "➕ Save & Add Another"}
                </button>
              )}

              {/* Save & Close */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEdit
                  ? "💾 Update Sermon"
                  : "🎉 Save & Close"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}