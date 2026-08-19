// ───────────────────────────────────────────────────────────────
// SERMONS FORM — Auto-sends push notification on new sermon
// ───────────────────────────────────────────────────────────────

"use client";

import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyNewSermon } from "@/lib/fcm-triggers";

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

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") +
    "-" +
    Date.now().toString().slice(-6)
  );
}

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

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export default function SermonsForm({ sermon, onSuccess, onCancel }: SermonsFormProps) {
  const isEdit = sermon !== null;

  const [formData, setFormData] = useState({
    title: sermon?.title || "",
    youtube_url: sermon?.youtube_url || "",
    sermon_date: sermon?.sermon_date?.split("T")[0] || new Date().toISOString().split("T")[0],
    description: sermon?.description || "",
    is_featured: sermon?.is_featured ?? false,
    is_published: sermon?.is_published ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const youtubeId = extractYouTubeId(formData.youtube_url);
  const thumbnail = youtubeId ? getYouTubeThumbnail(youtubeId) : null;

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

  const saveSermon = async (addAnother: boolean = false) => {
    if (!formData.title.trim()) { toast.error("Sermon title is required"); return; }
    if (!formData.youtube_url.trim()) { toast.error("YouTube URL is required"); return; }
    if (!youtubeId) { toast.error("Invalid YouTube URL. Please check the link."); return; }

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
        result = await supabase.from("sermons").update(payload).eq("id", sermon.id).select().single();
      } else {
        result = await supabase.from("sermons").insert(payload).select().single();
      }

      if (result.error) {
        toast.error(`Error: ${result.error.message}`);
        setIsSubmitting(false);
        return;
      }

      toast.success(isEdit ? "✅ Sermon updated!" : "🎉 Sermon added!");

      // ─── Auto-send push notification on NEW sermon (only if published) ───
      if (!isEdit && formData.is_published) {
        try {
          const pushResult = await notifyNewSermon(formData.title.trim(), result.data.id);
          if (pushResult.success) {
            toast.success(`🔔 Notified ${pushResult.successCount} devices`, { duration: 3000 });
          }
        } catch (err) {
          console.error("Push notification failed:", err);
          // Don't block the save flow if push fails
        }
      }

      if (addAnother && !isEdit) {
        resetForm();
        setIsSubmitting(false);
      } else {
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
      <div onClick={onCancel} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />

      {/* Modal — keep bg-white for form readability */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-2xl pointer-events-auto max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-brand-purple-900">
                  {isEdit ? "✏️ Edit Sermon" : "🎬 Add New Sermon"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {isEdit ? `Updating "${sermon?.title}"` : "Just paste a YouTube link and save!"}
                </p>
              </div>
              <button onClick={onCancel} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
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
                📝 Sermon Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. The Power of Prayer"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                required
              />
            </div>

            {/* YouTube URL */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                📺 YouTube URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                placeholder="Paste any YouTube link here..."
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                ✨ Accepts: youtube.com/watch, youtu.be, /embed/, /live/, /shorts/
              </p>
              {thumbnail && (
                <div className="mt-3 p-3 bg-green-50 rounded-xl border-2 border-green-200">
                  <p className="text-xs font-bold text-green-800 mb-2">✅ YouTube video detected! Preview:</p>
                  <img src={thumbnail} alt="Sermon thumbnail" className="w-full max-w-sm rounded-lg border-2 border-gray-200" loading="lazy" />
                </div>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">📅 Sermon Date</label>
              <input
                type="date"
                value={formData.sermon_date}
                onChange={(e) => setFormData({ ...formData, sermon_date: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">✏️ Short Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What is this sermon about? (optional)"
                rows={3}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
              />
            </div>

            {/* Toggles */}
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-100 space-y-3">
              <div className="flex items-center justify-between bg-white p-3 rounded-xl">
                <div>
                  <p className="font-bold text-brand-purple-900 text-sm">✅ Publish to Website</p>
                  <p className="text-xs text-gray-500">Make visible on the sermons page + send push notification</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${formData.is_published ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${formData.is_published ? "translate-x-9" : "translate-x-1"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between bg-white p-3 rounded-xl">
                <div>
                  <p className="font-bold text-brand-purple-900 text-sm">⭐ Featured Sermon</p>
                  <p className="text-xs text-gray-500">Show at the top of the sermons page</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${formData.is_featured ? "bg-brand-gold-500" : "bg-gray-300"}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${formData.is_featured ? "translate-x-9" : "translate-x-1"}`} />
                </button>
              </div>
            </div>

            {/* Push Notification Info */}
            {!isEdit && formData.is_published && (
              <div className="rounded-xl bg-blue-50 border-2 border-blue-200 p-3">
                <p className="text-xs text-blue-800 flex items-start gap-2">
                  <span className="text-lg leading-none">🔔</span>
                  <span>
                    <strong>Push notification will be sent</strong> to all registered devices when you save this sermon.
                  </span>
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-4 border-t-2 border-gray-100">
              <button type="button" onClick={onCancel} className="w-full px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all">
                Cancel
              </button>
              {!isEdit && (
                <button
                  type="button"
                  onClick={() => saveSermon(true)}
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 rounded-full bg-white text-brand-purple-900 font-black border-2 border-brand-purple-200 hover:border-brand-purple-400 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "➕ Save & Add Another"}
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : isEdit ? "💾 Update Sermon" : "🎉 Save & Close"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}