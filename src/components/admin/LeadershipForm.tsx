// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LEADERSHIP FORM — Modal form for adding/editing leaders
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Leader {
  id: string;
  full_name: string;
  title: string | null;
  role: string | null;
  bio: string | null;
  photo_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

interface LeadershipFormProps {
  leader: Leader | null; // null = add mode, object = edit mode
  onSuccess: (leader: Leader, isEdit: boolean) => void;
  onCancel: () => void;
}

export default function LeadershipForm({
  leader,
  onSuccess,
  onCancel,
}: LeadershipFormProps) {
  const isEdit = leader !== null;

  const [formData, setFormData] = useState({
    full_name: leader?.full_name || "",
    title: leader?.title || "",
    role: leader?.role || "",
    bio: leader?.bio || "",
    photo_url: leader?.photo_url || "",
    facebook_url: leader?.facebook_url || "",
    instagram_url: leader?.instagram_url || "",
    display_order: leader?.display_order || 0,
    is_active: leader?.is_active ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const payload = {
        full_name: formData.full_name.trim(),
        title: formData.title.trim() || null,
        role: formData.role.trim() || null,
        bio: formData.bio.trim() || null,
        photo_url: formData.photo_url.trim() || null,
        facebook_url: formData.facebook_url.trim() || null,
        instagram_url: formData.instagram_url.trim() || null,
        display_order: Number(formData.display_order) || 0,
        is_active: formData.is_active,
      };

      let result;
      if (isEdit && leader) {
        result = await supabase
          .from("leadership")
          .update(payload)
          .eq("id", leader.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("leadership")
          .insert(payload)
          .select()
          .single();
      }

      if (result.error) {
        console.error("Supabase error:", result.error);
        toast.error(`Error: ${result.error.message}`);
        return;
      }

      toast.success(isEdit ? "✅ Leader updated!" : "🎉 Leader added!", {
        style: {
          background: "#6B1F8A",
          color: "#fff",
          border: "1px solid #FFC72C",
        },
      });

      onSuccess(result.data as Leader, isEdit);
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
                  {isEdit ? "✏️ Edit Leader" : "➕ Add New Leader"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {isEdit
                    ? `Updating ${leader?.full_name}`
                    : "Add a new team member to the leadership page"}
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
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                placeholder="Prophet Olayiwole Ogunsola"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                required
              />
            </div>

            {/* Title + Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="Prophet, Pastor, Elder..."
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  placeholder="Founder & General Overseer"
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                Bio (Short Description)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Brief description about this leader..."
                rows={4}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
              />
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                Photo URL
              </label>
              <input
                type="url"
                value={formData.photo_url}
                onChange={(e) =>
                  setFormData({ ...formData, photo_url: e.target.value })
                }
                placeholder="https://... (link to photo)"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">
                📸 Upload photo to Imgur/Google Drive, then paste link here
              </p>
            </div>

            {/* Social URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={formData.facebook_url}
                  onChange={(e) =>
                    setFormData({ ...formData, facebook_url: e.target.value })
                  }
                  placeholder="https://facebook.com/..."
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.instagram_url}
                  onChange={(e) =>
                    setFormData({ ...formData, instagram_url: e.target.value })
                  }
                  placeholder="https://instagram.com/..."
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Display Order + Active */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                  Visibility
                </label>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, is_active: !formData.is_active })
                    }
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                      formData.is_active ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                        formData.is_active ? "translate-x-9" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className={`font-bold text-sm ${
                    formData.is_active ? "text-green-600" : "text-gray-500"
                  }`}>
                    {formData.is_active ? "👁️ Visible" : "🙈 Hidden"}
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
                  <>{isEdit ? "💾 Update Leader" : "🎉 Add Leader"}</>
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