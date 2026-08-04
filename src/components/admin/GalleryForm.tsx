// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GALLERY FORM — Upload photos directly from computer
// Modal keeps bg-white for form readability
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState, useRef, FormEvent } from "react";
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
  { value: "service", label: "✨ Service" },
  { value: "general", label: "📸 General" },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function GalleryForm({ item, onSuccess, onCancel }: GalleryFormProps) {
  const isEdit = item !== null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    category: item?.category || "general",
    display_order: item?.display_order || 0,
    is_published: item?.is_published ?? true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(item?.image_url || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) { toast.error("File too large! Max 5 MB"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", category: "general", display_order: 0, is_published: true });
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const savePhoto = async (addAnother: boolean = false) => {
    if (!isEdit && !selectedFile) { toast.error("Please select a photo to upload"); return; }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      let imageUrl = item?.image_url || "";

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `gallery-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("gallery").upload(fileName, selectedFile, { cacheControl: "3600", upsert: false });
        if (uploadError) { toast.error(`Upload failed: ${uploadError.message}`); setIsSubmitting(false); return; }
        const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const payload = {
        title: formData.title.trim() || null,
        description: formData.description.trim() || null,
        image_url: imageUrl,
        category: formData.category,
        display_order: formData.display_order,
        is_published: formData.is_published,
      };

      let result;
      if (isEdit && item) {
        result = await supabase.from("gallery").update(payload).eq("id", item.id).select().single();
      } else {
        result = await supabase.from("gallery").insert(payload).select().single();
      }

      if (result.error) { toast.error(`Error: ${result.error.message}`); setIsSubmitting(false); return; }

      toast.success(isEdit ? "✅ Photo updated!" : "🎉 Photo uploaded!");

      if (addAnother && !isEdit) { resetForm(); setIsSubmitting(false); }
      else { onSuccess(result.data as GalleryItem, isEdit); }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); savePhoto(false); };

  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-2xl pointer-events-auto max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-brand-purple-900">
                  {isEdit ? "✏️ Edit Photo" : "📸 Upload New Photo"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {isEdit ? "Updating photo" : "Upload a photo from your computer"}
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
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">
                📸 Select Photo {!isEdit && <span className="text-red-500">*</span>}
              </label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="gallery-upload" />
              <label htmlFor="gallery-upload" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-brand-purple-900 font-black border-2 border-brand-purple-200 hover:border-brand-purple-400 cursor-pointer transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                {selectedFile ? "Change Photo" : "Choose Photo"}
              </label>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP • Max 5 MB</p>
              {previewUrl && (
                <div className="mt-3">
                  <img src={previewUrl} alt="Preview" className="w-full max-w-xs rounded-xl border-2 border-gray-200" loading="lazy" />
                  {selectedFile && <p className="text-xs text-green-600 font-semibold mt-1">✅ {selectedFile.name}</p>}
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">Photo Title</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Sunday Service Worship" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-brand-purple-900 mb-2">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Short description..." rows={2} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
            </div>

            {/* Category + Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white">
                  {CATEGORIES.map((cat) => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-purple-900 mb-2">Display Order</label>
                <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} min="0" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
              </div>
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
              <div>
                <p className="font-bold text-brand-purple-900 text-sm">✅ Publish Photo</p>
                <p className="text-xs text-gray-500">Make visible on the gallery page</p>
              </div>
              <button type="button" onClick={() => setFormData({ ...formData, is_published: !formData.is_published })} className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${formData.is_published ? "bg-green-500" : "bg-gray-300"}`}>
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${formData.is_published ? "translate-x-9" : "translate-x-1"}`} />
              </button>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-4 border-t-2 border-gray-100">
              <button type="submit" disabled={isSubmitting || (!isEdit && !selectedFile)} className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all disabled:opacity-50">
                {isSubmitting ? "Uploading..." : isEdit ? "💾 Update Photo" : "🎉 Upload Photo"}
              </button>
              {!isEdit && (
                <button type="button" onClick={() => savePhoto(true)} disabled={isSubmitting || !selectedFile} className="w-full px-6 py-3 rounded-full bg-white text-brand-purple-900 font-black border-2 border-brand-purple-200 hover:border-brand-purple-400 transition-all disabled:opacity-50">
                  {isSubmitting ? "Uploading..." : "➕ Save & Add Another"}
                </button>
              )}
              <button type="button" onClick={onCancel} className="w-full px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}