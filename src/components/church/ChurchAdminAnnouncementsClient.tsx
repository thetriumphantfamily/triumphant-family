// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN ANNOUNCEMENTS – Post + notify all members
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyAllMembers } from "@/lib/notifications";
import LoadingScreen from "./LoadingScreen";

interface Announcement {
  id: string;
  title: string;
  body: string;
  is_important: boolean;
  target_department: string | null;
  created_at: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function timeAgo(d: string): string {
  const now = new Date();
  const then = new Date(d);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

export default function ChurchAdminAnnouncementsClient() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "", body: "", is_important: false, target_department: "",
  });

  useEffect(() => { loadAnnouncements(); }, []);

  const loadAnnouncements = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tfam_member_announcements")
        .select("*")
        .order("created_at", { ascending: false });
      setAnnouncements(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ title: "", body: "", is_important: false, target_department: "" });
    setShowForm(false);
    setEditingId(null);
  };

  const openEdit = (a: Announcement) => {
    setFormData({
      title: a.title, body: a.body,
      is_important: a.is_important,
      target_department: a.target_department || "",
    });
    setEditingId(a.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) {
      toast.error("Title and message required"); return;
    }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        title: formData.title.trim(),
        body: formData.body.trim(),
        is_important: formData.is_important,
        target_department: formData.target_department.trim() || null,
      };
      if (editingId) {
        await supabase.from("tfam_member_announcements").update(payload).eq("id", editingId);
        toast.success("✅ Updated!");
      } else {
        await supabase.from("tfam_member_announcements").insert(payload);
        await notifyAllMembers({
          title: formData.is_important ? "🚨 Important Announcement" : "📢 New Announcement",
          message: `${formData.title}${formData.body.length > 80 ? ` — ${formData.body.substring(0, 80)}...` : ""}`,
          type: "announcement",
          link: "/member/announcements",
        });
        toast.success("📢 Announcement posted and members notified!");
      }
      resetForm();
      loadAnnouncements();
    } catch { toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_member_announcements").delete().eq("id", id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading announcements..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Announcements</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
            Church Announcements
          </h1>
          <p className="text-brand-purple-100 text-sm">
            Post notices and updates for all members.
          </p>
          <div className="flex gap-4 pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{announcements.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">
                {announcements.filter((a) => a.is_important).length}
              </p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Important</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Post Button — full width mobile ── */}
      <button
        onClick={() => setShowForm(true)}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
      >
        ➕ Post Announcement
      </button>

      {/* ── Empty State ── */}
      {announcements.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-4xl mb-4">📢</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">No announcements yet</h3>
          <p className="text-brand-purple-200 text-sm">Post your first announcement for members.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div
              key={a.id}
              className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                a.is_important ? "border-red-400/60" : "border-brand-gold-400/40"
              } p-5 shadow-xl`}
            >
              <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${
                a.is_important
                  ? "from-red-400 via-red-500 to-red-400"
                  : "from-brand-gold-300 via-brand-gold-400 to-brand-gold-500"
              }`} />

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {a.is_important && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-red-500 text-white animate-pulse">
                    🔴 IMPORTANT
                  </span>
                )}
                {a.target_department && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/40">
                    📋 {a.target_department}
                  </span>
                )}
              </div>

              <p className="font-black text-white text-base mb-2">{a.title}</p>
              <p className="text-white font-semibold text-sm whitespace-pre-wrap">{a.body}</p>
              <p className="text-brand-purple-200 font-semibold text-xs mt-3">
                📅 {timeAgo(a.created_at)}
              </p>

              {/* Actions — full width stacked */}
              <div className="flex flex-col gap-2 pt-3 border-t border-brand-gold-400/30 mt-3">
                <button
                  onClick={() => openEdit(a)}
                  className="w-full py-2.5 rounded-xl bg-white text-brand-purple-900 text-xs font-black active:scale-95 transition-all"
                >
                  ✏️ Edit Announcement
                </button>
                <button
                  onClick={() => deleteAnnouncement(a.id)}
                  className="w-full py-2.5 rounded-xl bg-red-500/20 text-red-300 text-xs font-bold border border-red-400/40 active:scale-95 transition-all"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Form Modal — KEEP bg-white — slides up mobile ── */}
      {showForm && (
        <>
          <div onClick={resetForm} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">
                    📢 {editingId ? "Edit" : "Post"} Announcement
                  </h2>
                  <button
                    onClick={resetForm}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Sunday Service Update"
                    required
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    rows={5}
                    placeholder="Write announcement details..."
                    required
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Target Department (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.target_department}
                    onChange={(e) => setFormData({ ...formData, target_department: e.target.value })}
                    placeholder="Leave empty for all members"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  />
                </div>
                <label
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setFormData({ ...formData, is_important: !formData.is_important })}
                >
                  <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.is_important ? "bg-red-500" : "bg-gray-300"}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.is_important ? "translate-x-7" : "translate-x-1"}`} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">🔴 Mark as Important</span>
                </label>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Posting..." : editingId ? "✅ Update" : "📢 Post & Notify All Members"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}