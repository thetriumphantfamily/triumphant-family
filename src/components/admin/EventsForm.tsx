// ───────────────────────────────────────────────────────────────
// EVENTS FORM — Auto-sends push notification on new event
// ───────────────────────────────────────────────────────────────

"use client";

import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyNewEvent } from "@/lib/fcm-triggers";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  event_date: string;
  location: string | null;
  is_online: boolean;
  online_link: string | null;
  flyer_url: string | null;
  registration_required: boolean;
  registration_link: string | null;
  category: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface EventsFormProps {
  event: Event | null;
  onSuccess: (event: Event, isEdit: boolean) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  { value: "service", label: "⛪ Service" },
  { value: "conference", label: "🎤 Conference" },
  { value: "crusade", label: "🔥 Crusade" },
  { value: "prayer", label: "🙏 Prayer Meeting" },
  { value: "outreach", label: "🌍 Outreach" },
  { value: "training", label: "📚 Training" },
  { value: "fellowship", label: "👥 Fellowship" },
  { value: "general", label: "📅 General" },
];

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function toDatetimeLocal(iso: string): string {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function EventsForm({ event, onSuccess, onCancel }: EventsFormProps) {
  const isEdit = event !== null;

  const [formData, setFormData] = useState({
    title: event?.title || "",
    slug: event?.slug || "",
    description: event?.description || "",
    event_date: event?.event_date ? toDatetimeLocal(event.event_date) : "",
    location: event?.location || "",
    is_online: event?.is_online ?? false,
    online_link: event?.online_link || "",
    flyer_url: event?.flyer_url || "",
    registration_required: event?.registration_required ?? false,
    registration_link: event?.registration_link || "",
    category: event?.category || "general",
    is_featured: event?.is_featured ?? false,
    is_published: event?.is_published ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title, slug: isEdit ? formData.slug : slugify(title) });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error("Title is required"); return; }
    if (!formData.slug.trim()) { toast.error("Slug is required"); return; }
    if (!formData.event_date) { toast.error("Event date is required"); return; }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || null,
        event_date: new Date(formData.event_date).toISOString(),
        location: formData.location.trim() || null,
        is_online: formData.is_online,
        online_link: formData.online_link.trim() || null,
        flyer_url: formData.flyer_url.trim() || null,
        registration_required: formData.registration_required,
        registration_link: formData.registration_link.trim() || null,
        category: formData.category || null,
        is_featured: formData.is_featured,
        is_published: formData.is_published,
      };

      let result;
      if (isEdit && event) {
        result = await supabase.from("events").update(payload).eq("id", event.id).select().single();
      } else {
        result = await supabase.from("events").insert(payload).select().single();
      }

      if (result.error) { toast.error(`Error: ${result.error.message}`); return; }

      toast.success(isEdit ? "✅ Event updated!" : "🎉 Event added!");

      // ─── Auto-send push notification on NEW event (only if published) ───
      if (!isEdit && formData.is_published) {
        try {
          const pushResult = await notifyNewEvent(formData.title.trim(), result.data.id);
          if (pushResult.success) {
            toast.success(`🔔 Notified ${pushResult.successCount} devices`, { duration: 3000 });
          }
        } catch (err) {
          console.error("Push notification failed:", err);
          // Don't block save if push fails
        }
      }

      onSuccess(result.data as Event, isEdit);
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-3xl pointer-events-auto max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-brand-purple-900">
                  {isEdit ? "✏️ Edit Event" : "📅 Add New Event"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {isEdit ? `Updating "${event?.title}"` : "Add a new ministry event"}
                </p>
              </div>
              <button onClick={onCancel} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">Event Title <span className="text-red-500">*</span></label>
              <input type="text" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Prayer & Fasting Conference" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" required />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">URL Slug <span className="text-red-500">*</span></label>
              <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="prayer-fasting-conference" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" required />
              <p className="text-xs text-gray-500 mt-1">URL: /events/{formData.slug || "slug-here"}</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="What is this event about?" rows={3} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
            </div>

            {/* Date + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">Event Date & Time <span className="text-red-500">*</span></label>
                <input type="datetime-local" value={formData.event_date} onChange={(e) => setFormData({ ...formData, event_date: e.target.value })} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white">
                  {CATEGORIES.map((cat) => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">Location</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="1, Arifanla Bus Stop, Akute" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
            </div>

            {/* Online Toggle */}
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-sm font-bold text-brand-purple-900">Online Event?</label>
                  <p className="text-xs text-gray-500 mt-0.5">Toggle if event has virtual attendance</p>
                </div>
                <button type="button" onClick={() => setFormData({ ...formData, is_online: !formData.is_online })} className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${formData.is_online ? "bg-blue-500" : "bg-gray-300"}`}>
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${formData.is_online ? "translate-x-9" : "translate-x-1"}`} />
                </button>
              </div>
              {formData.is_online && (
                <input type="url" value={formData.online_link} onChange={(e) => setFormData({ ...formData, online_link: e.target.value })} placeholder="https://zoom.us/... or YouTube live URL" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
              )}
            </div>

            {/* Registration Toggle */}
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-sm font-bold text-brand-purple-900">Registration Required?</label>
                  <p className="text-xs text-gray-500 mt-0.5">Toggle if attendees need to register</p>
                </div>
                <button type="button" onClick={() => setFormData({ ...formData, registration_required: !formData.registration_required })} className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${formData.registration_required ? "bg-brand-gold-500" : "bg-gray-300"}`}>
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${formData.registration_required ? "translate-x-9" : "translate-x-1"}`} />
                </button>
              </div>
              {formData.registration_required && (
                <input type="url" value={formData.registration_link} onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })} placeholder="https://forms.google.com/..." className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
              )}
            </div>

            {/* Flyer URL */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">Event Flyer URL</label>
              <input type="url" value={formData.flyer_url} onChange={(e) => setFormData({ ...formData, flyer_url: e.target.value })} placeholder="https://... (link to event flyer image)" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
              <p className="text-xs text-gray-500 mt-1">📸 Upload flyer to Imgur/Drive, paste link here</p>
            </div>

            {/* Status Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">Publish Status</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setFormData({ ...formData, is_published: !formData.is_published })} className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${formData.is_published ? "bg-green-500" : "bg-gray-300"}`}>
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${formData.is_published ? "translate-x-9" : "translate-x-1"}`} />
                  </button>
                  <span className={`font-bold text-sm ${formData.is_published ? "text-green-600" : "text-gray-500"}`}>
                    {formData.is_published ? "✅ Published" : "📝 Draft"}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">Featured Event</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })} className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${formData.is_featured ? "bg-brand-gold-500" : "bg-gray-300"}`}>
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${formData.is_featured ? "translate-x-9" : "translate-x-1"}`} />
                  </button>
                  <span className={`font-bold text-sm ${formData.is_featured ? "text-brand-gold-600" : "text-gray-500"}`}>
                    {formData.is_featured ? "⭐ Featured" : "Not featured"}
                  </span>
                </div>
              </div>
            </div>

            {/* Push Notification Info */}
            {!isEdit && formData.is_published && (
              <div className="rounded-xl bg-blue-50 border-2 border-blue-200 p-3">
                <p className="text-xs text-blue-800 flex items-start gap-2">
                  <span className="text-lg leading-none">🔔</span>
                  <span>
                    <strong>Push notification will be sent</strong> to all registered devices when you save this event.
                  </span>
                </p>
              </div>
            )}

            {/* Buttons — stacked mobile first */}
            <div className="flex flex-col gap-3 pt-4 border-t-2 border-gray-100">
              <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all disabled:opacity-50">
                {isSubmitting ? (
                  <><span className="w-5 h-5 border-2 border-brand-purple-900/30 border-t-brand-purple-900 rounded-full animate-spin" />Saving...</>
                ) : (
                  <>{isEdit ? "💾 Update Event" : "🎉 Add Event"}</>
                )}
              </button>
              <button type="button" onClick={onCancel} className="w-full px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}