// ───────────────────────────────────────────────────────────────
// TDA ADMIN ANNOUNCEMENTS CLIENT – Post + notify students
// Now with FCM push notifications too
// ───────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";
import { notifyAllTDAStudents } from "@/lib/tda-notifications";
import { sendPushNotification } from "@/lib/fcm-triggers";

interface Announcement {
  id: string;
  title: string;
  body: string;
  is_important: boolean;
  level: string | null;
  created_at: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function TDAAdminAnnouncementsClient() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: "", body: "", is_important: false, level: "",
  });

  useEffect(() => { loadAnnouncements(); }, []);

  const loadAnnouncements = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tda_announcements").select("*").order("created_at", { ascending: false });
      setAnnouncements(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const openCreateForm = () => {
    setFormData({ title: "", body: "", is_important: false, level: "" });
    setEditingAnnouncement(null);
    setShowForm(true);
  };

  const openEditForm = (announcement: Announcement) => {
    setFormData({
      title: announcement.title, body: announcement.body,
      is_important: announcement.is_important, level: announcement.level || "",
    });
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: "", body: "", is_important: false, level: "" });
    setEditingAnnouncement(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) { toast.error("Please enter title and message"); return; }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        title: formData.title.trim(), body: formData.body.trim(),
        is_important: formData.is_important, level: formData.level || null,
      };
      if (editingAnnouncement) {
        const { error } = await supabase.from("tda_announcements").update(payload).eq("id", editingAnnouncement.id);
        if (error) { toast.error(`Failed: ${error.message}`); setIsSubmitting(false); return; }
        toast.success("✅ Announcement updated!");
      } else {
        const { error } = await supabase.from("tda_announcements").insert(payload);
        if (error) { toast.error(`Failed: ${error.message}`); setIsSubmitting(false); return; }

        // In-app notifications (existing)
        await notifyAllTDAStudents({
          title: formData.is_important ? `🚨 Important: ${formData.title}` : `📢 ${formData.title}`,
          message: formData.body.substring(0, 150) + (formData.body.length > 150 ? "..." : ""),
          type: "announcement",
          link: "/bible-school/portal/announcements",
        });

        toast.success("📢 Announcement posted and students notified!");

        // ─── FCM PUSH notification (new!) ───
        try {
          const pushTitle = formData.is_important ? `🚨 ${formData.title}` : `📢 ${formData.title}`;
          const pushMessage = formData.body.substring(0, 150) + (formData.body.length > 150 ? "..." : "");
          const pushResult = await sendPushNotification({
            title: pushTitle,
            message: pushMessage,
            target: "students",
            link: "/bible-school/portal/announcements",
          });
          if (pushResult.success) {
            toast.success(`🔔 Push sent to ${pushResult.successCount} students`, { duration: 3000 });
          }
        } catch (err) {
          console.error("Push notification failed:", err);
        }
      }
      resetForm();
      loadAnnouncements();
    } catch { toast.error("Something went wrong"); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tda_announcements").delete().eq("id", id);
      if (error) { toast.error("Failed to delete"); setBusyId(null); return; }
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      toast.success("🗑️ Deleted");
    } catch { toast.error("Delete failed"); }
    finally { setBusyId(null); }
  };

  const toggleImportant = async (id: string, current: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tda_announcements").update({ is_important: !current }).eq("id", id);
      if (error) { toast.error("Failed to update"); setBusyId(null); return; }
      setAnnouncements((prev) => prev.map((a) => a.id === id ? { ...a, is_important: !current } : a));
      toast.success(!current ? "🚨 Marked as important" : "✓ Removed important flag");
    } catch { toast.error("Failed to update"); }
    finally { setBusyId(null); }
  };

  const stats = {
    total: announcements.length,
    important: announcements.filter((a) => a.is_important).length,
    regular: announcements.filter((a) => !a.is_important).length,
  };

  if (loading) return <LoadingScreen message="Loading announcements..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* Page Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Announcements</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
            📢 Announcements
          </h1>
          <p className="text-brand-purple-200 text-sm mb-4">
            Post school-wide messages. Students get in-app + push notifications.
          </p>
          <button onClick={openCreateForm}
            className="w-full md:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all">
            ➕ Post Announcement
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: stats.total, border: "border-brand-gold-400/40" },
          { label: "Important", value: stats.important, border: "border-red-400/40" },
          { label: "Regular", value: stats.regular, border: "border-brand-gold-400/40" },
        ].map((s) => (
          <div key={s.label} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${s.border} p-4 shadow-xl`}>
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">{s.label}</p>
            <p className="text-white font-black text-3xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">📢</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">No announcements yet</h3>
          <p className="text-brand-purple-200 text-sm">Click &ldquo;Post Announcement&rdquo; to share news with students</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => {
            const isBusy = busyId === announcement.id;
            return (
              <div key={announcement.id} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                announcement.is_important ? "border-red-400/60" : "border-brand-gold-400/40"
              } p-5 shadow-xl`}>
                <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${
                  announcement.is_important ? "from-red-400 via-red-500 to-red-400" : "from-brand-gold-300 via-brand-gold-400 to-brand-gold-500"
                }`} />
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {announcement.is_important && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase">Important</span>
                  )}
                  {announcement.level && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black border border-blue-400/40">Level {announcement.level}</span>
                  )}
                  <span className="text-brand-purple-200 text-xs font-semibold">{formatDate(announcement.created_at)}</span>
                </div>
                <p className="font-black text-white text-base leading-tight mb-2">{announcement.title}</p>
                <p className="text-white font-semibold text-sm leading-relaxed whitespace-pre-line">{announcement.body}</p>
                <div className="flex flex-col gap-2 pt-3 border-t border-brand-gold-400/30 mt-3">
                  <button onClick={() => openEditForm(announcement)}
                    className="w-full py-2.5 rounded-xl bg-white text-brand-purple-900 text-xs font-black active:scale-95 transition-all">
                    ✏️ Edit Announcement
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => toggleImportant(announcement.id, announcement.is_important)} disabled={isBusy}
                      className="py-2 rounded-xl bg-brand-purple-950/60 text-white text-xs font-bold border border-brand-gold-400/40 disabled:opacity-50">
                      {announcement.is_important ? "✓ Unmark" : "🚨 Mark Important"}
                    </button>
                    <button onClick={() => handleDelete(announcement.id, announcement.title)} disabled={isBusy}
                      className="py-2 rounded-xl bg-red-600 text-white text-xs font-black disabled:opacity-50 active:scale-95 transition-all">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FORM MODAL */}
      {showForm && (
        <>
          <div onClick={resetForm} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">
                    {editingAnnouncement ? "✏️ Edit Announcement" : "📢 Post Announcement"}
                  </h2>
                  <button onClick={resetForm} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Special Prayer Meeting This Friday" required
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message <span className="text-red-500">*</span></label>
                  <textarea value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder="Write your announcement here..." rows={8} required
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Target Level</label>
                  <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white">
                    <option value="">All Students</option>
                    <option value="100">Level 100 only</option>
                    <option value="200">Level 200 only</option>
                    <option value="300">Level 300 only</option>
                    <option value="400">Level 400 only</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <p className="font-bold text-brand-purple-900">🚨 Mark as Important</p>
                    <p className="text-xs text-gray-500 mt-1">Highlighted for students</p>
                  </div>
                  <button type="button" onClick={() => setFormData({ ...formData, is_important: !formData.is_important })}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors flex-shrink-0 ${formData.is_important ? "bg-red-500" : "bg-gray-300"}`}>
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${formData.is_important ? "translate-x-9" : "translate-x-1"}`} />
                  </button>
                </div>

                {!editingAnnouncement && (
                  <div className="rounded-xl bg-blue-50 border-2 border-blue-200 p-3">
                    <p className="text-xs text-blue-800 flex items-start gap-2">
                      <span className="text-lg leading-none">🔔</span>
                      <span>
                        <strong>Students will get in-app notification + push notification</strong> on their phones.
                      </span>
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button type="submit" disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                    {isSubmitting ? "Saving..." : editingAnnouncement ? "💾 Save Changes" : "📢 Post & Notify Students"}
                  </button>
                  <button type="button" onClick={resetForm} className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}