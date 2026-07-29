// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN ANNOUNCEMENTS CLIENT — Post, edit, delete announcements
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

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
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TDAAdminAnnouncementsClient() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    is_important: false,
    level: "",
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tda_announcements")
        .select("*")
        .order("created_at", { ascending: false });

      setAnnouncements(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setFormData({
      title: "",
      body: "",
      is_important: false,
      level: "",
    });
    setEditingAnnouncement(null);
    setShowForm(true);
  };

  const openEditForm = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      body: announcement.body,
      is_important: announcement.is_important,
      level: announcement.level || "",
    });
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      body: "",
      is_important: false,
      level: "",
    });
    setEditingAnnouncement(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.body.trim()) {
      toast.error("Please enter title and message");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      if (editingAnnouncement) {
        // Update
        const { error } = await supabase
          .from("tda_announcements")
          .update({
            title: formData.title.trim(),
            body: formData.body.trim(),
            is_important: formData.is_important,
            level: formData.level || null,
          })
          .eq("id", editingAnnouncement.id);

        if (error) {
          toast.error(`Failed: ${error.message}`);
          setIsSubmitting(false);
          return;
        }

        toast.success("✅ Announcement updated!");
      } else {
        // Create
        const { error } = await supabase.from("tda_announcements").insert({
          title: formData.title.trim(),
          body: formData.body.trim(),
          is_important: formData.is_important,
          level: formData.level || null,
        });

        if (error) {
          toast.error(`Failed: ${error.message}`);
          setIsSubmitting(false);
          return;
        }

        toast.success("📢 Announcement posted!");
      }

      resetForm();
      loadAnnouncements();
      setIsSubmitting(false);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Something went wrong");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;

    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("tda_announcements")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("Failed to delete");
        setBusyId(null);
        return;
      }

      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      toast.success("🗑️ Deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const toggleImportant = async (id: string, current: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("tda_announcements")
        .update({ is_important: !current })
        .eq("id", id);

      if (error) {
        toast.error("Failed to update");
        setBusyId(null);
        return;
      }

      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, is_important: !current } : a
        )
      );
      toast.success(
        !current ? "🚨 Marked as important" : "✓ Removed important flag"
      );
    } catch (err) {
      console.error("Toggle error:", err);
      toast.error("Failed to update");
    } finally {
      setBusyId(null);
    }
  };

  const stats = {
    total: announcements.length,
    important: announcements.filter((a) => a.is_important).length,
    regular: announcements.filter((a) => !a.is_important).length,
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading announcements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
            📢 Announcements
          </h1>
          <p className="text-gray-600 text-sm">
            Post school-wide messages for your students
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all"
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
          Post Announcement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
            Total
          </p>
          <p className="text-3xl font-bold text-brand-purple-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-red-200 shadow-md">
          <p className="text-xs text-red-600 uppercase font-semibold mb-1">
            Important
          </p>
          <p className="text-3xl font-bold text-red-600">{stats.important}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-blue-200 shadow-md">
          <p className="text-xs text-blue-600 uppercase font-semibold mb-1">
            Regular
          </p>
          <p className="text-3xl font-bold text-blue-600">{stats.regular}</p>
        </div>
      </div>

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
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
                d="M10.34 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
              />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            No announcements yet
          </h3>
          <p className="text-gray-500">
            Click &ldquo;Post Announcement&rdquo; to share news with students
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => {
            const isBusy = busyId === announcement.id;

            return (
              <div
                key={announcement.id}
                className={`bg-white rounded-2xl p-5 border-2 shadow-md hover:shadow-lg transition-all ${
                  announcement.is_important
                    ? "border-red-200"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${
                      announcement.is_important
                        ? "bg-red-100 text-red-600"
                        : "bg-brand-purple-100 text-brand-purple-600"
                    }`}
                  >
                    {announcement.is_important ? "🚨" : "📢"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {announcement.is_important && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest">
                          Important
                        </span>
                      )}
                      {announcement.level && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                          Level {announcement.level}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDate(announcement.created_at)}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-brand-purple-900 text-lg leading-tight mb-2">
                      {announcement.title}
                    </h3>

                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      {announcement.body}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => openEditForm(announcement)}
                    className="flex-1 px-3 py-2 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-xs font-bold transition-all"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() =>
                      toggleImportant(announcement.id, announcement.is_important)
                    }
                    disabled={isBusy}
                    className={`flex-1 px-3 py-2 rounded-full text-xs font-bold transition-all disabled:opacity-50 ${
                      announcement.is_important
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        : "bg-red-100 hover:bg-red-200 text-red-700"
                    }`}
                  >
                    {announcement.is_important ? "✓ Unmark" : "🚨 Mark Important"}
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id, announcement.title)}
                    disabled={isBusy}
                    className="px-3 py-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold transition-all disabled:opacity-50"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ━━━ FORM MODAL ━━━ */}
      {showForm && (
        <>
          <div
            onClick={resetForm}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-brand-purple-900">
                      {editingAnnouncement ? "✏️ Edit Announcement" : "📢 Post Announcement"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {editingAnnouncement ? "Update your message" : "Share news with your students"}
                    </p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
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

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Special Prayer Meeting This Friday"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.body}
                    onChange={(e) =>
                      setFormData({ ...formData, body: e.target.value })
                    }
                    placeholder="Write your announcement here..."
                    rows={8}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Target Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
                  >
                    <option value="">All Students</option>
                    <option value="100">Level 100 only</option>
                    <option value="200">Level 200 only</option>
                    <option value="300">Level 300 only</option>
                    <option value="400">Level 400 only</option>
                  </select>
                </div>

                {/* Important Toggle */}
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border-2 border-red-100">
                  <div>
                    <p className="font-bold text-brand-purple-900 flex items-center gap-2">
                      🚨 Mark as Important
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Important announcements are highlighted for students
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        is_important: !formData.is_important,
                      })
                    }
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors flex-shrink-0 ${
                      formData.is_important ? "bg-red-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                        formData.is_important ? "translate-x-9" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingAnnouncement
                      ? "💾 Save Changes"
                      : "📢 Post Now"}
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