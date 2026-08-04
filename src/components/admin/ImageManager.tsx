// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IMAGE MANAGER — Upload, view, reorder, and delete hero photos
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

interface HeroPhoto {
  id: string;
  url: string;
  storage_path: string;
  caption: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ImageManager({ initialPhotos }: { initialPhotos: HeroPhoto[] }) {
  const router = useRouter();
  const [photos, setPhotos] = useState<HeroPhoto[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading) return <LoadingScreen message="Loading images..." />;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) { toast.error("File too large! Max size is 5 MB"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file"); return; }

    setUploading(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("hero-photos").upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (uploadError) { toast.error(`Upload failed: ${uploadError.message}`); setUploading(false); return; }

      const { data: { publicUrl } } = supabase.storage.from("hero-photos").getPublicUrl(fileName);
      const nextPosition = photos.length > 0 ? Math.max(...photos.map((p) => p.position)) + 1 : 0;

      const { data: newPhoto, error: dbError } = await supabase.from("hero_photos").insert({ url: publicUrl, storage_path: fileName, position: nextPosition, is_active: true }).select().single();
      if (dbError) { toast.error(`Database error: ${dbError.message}`); setUploading(false); return; }

      setPhotos((prev) => [...prev, newPhoto as HeroPhoto]);
      toast.success("🎉 Photo uploaded!");
      router.refresh();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("hero_photos").update({ is_active: !current }).eq("id", id);
      if (error) throw error;
      setPhotos((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !current } : p));
      toast.success(current ? "Hidden from site" : "✅ Now visible!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update");
    } finally {
      setBusyId(null);
    }
  };

  const moveUp = async (id: string) => {
    const currentIndex = photos.findIndex((p) => p.id === id);
    if (currentIndex <= 0) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      const current = photos[currentIndex];
      const above = photos[currentIndex - 1];
      await supabase.from("hero_photos").update({ position: above.position }).eq("id", current.id);
      await supabase.from("hero_photos").update({ position: current.position }).eq("id", above.id);
      const newPhotos = [...photos];
      newPhotos[currentIndex] = { ...above, position: current.position };
      newPhotos[currentIndex - 1] = { ...current, position: above.position };
      setPhotos(newPhotos);
      toast.success("⬆️ Moved up");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not reorder");
    } finally {
      setBusyId(null);
    }
  };

  const moveDown = async (id: string) => {
    const currentIndex = photos.findIndex((p) => p.id === id);
    if (currentIndex >= photos.length - 1) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      const current = photos[currentIndex];
      const below = photos[currentIndex + 1];
      await supabase.from("hero_photos").update({ position: below.position }).eq("id", current.id);
      await supabase.from("hero_photos").update({ position: current.position }).eq("id", below.id);
      const newPhotos = [...photos];
      newPhotos[currentIndex] = { ...below, position: current.position };
      newPhotos[currentIndex + 1] = { ...current, position: below.position };
      setPhotos(newPhotos);
      toast.success("⬇️ Moved down");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not reorder");
    } finally {
      setBusyId(null);
    }
  };

  const deletePhoto = async (id: string, storagePath: string) => {
    if (!confirm("Delete this photo permanently?\n\nThis cannot be undone.")) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      await supabase.storage.from("hero-photos").remove([storagePath]);
      const { error: dbError } = await supabase.from("hero_photos").delete().eq("id", id);
      if (dbError) throw dbError;
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      toast.success("🗑️ Deleted");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not delete");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      {/* Upload Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl mb-6">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10 flex items-center gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-xl font-black text-white">Upload New Hero Photo</h2>
            <p className="text-brand-purple-200 font-semibold text-sm">JPG, PNG, WEBP • Max 5 MB per file</p>
          </div>
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" id="photo-upload" />
            <label htmlFor="photo-upload" className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-black cursor-pointer transition-all ${uploading ? "bg-brand-purple-950/60 text-brand-purple-300 cursor-not-allowed border border-brand-gold-400/40" : "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold hover:scale-105"}`}>
              {uploading ? (
                <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Uploading...</>
              ) : (
                <><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>📸 Choose Photo</>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {photos.length === 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-12 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">🖼️</div>
          <h3 className="font-heading text-2xl font-black text-white mb-2">No hero photos yet</h3>
          <p className="text-brand-purple-200 font-semibold">Upload your first hero photo to get started!</p>
        </div>
      )}

      {/* Photos grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => {
            const isBusy = busyId === photo.id;
            const isFirst = index === 0;
            const isLast = index === photos.length - 1;

            return (
              <div
                key={photo.id}
                className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 shadow-xl transition-all ${photo.is_active ? "border-brand-gold-400/40" : "border-brand-gold-400/20 opacity-60"}`}
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                {/* Photo */}
                <div className="relative aspect-video">
                  <img src={photo.url} alt="Hero photo" className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-brand-purple-950/80 text-white text-xs font-black border border-brand-gold-400/40">
                    #{index + 1}
                  </div>
                  <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-black ${photo.is_active ? "bg-green-500 text-white" : "bg-brand-purple-950/80 text-white border border-brand-gold-400/40"}`}>
                    {photo.is_active ? "✅ Active" : "🙈 Hidden"}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button onClick={() => moveUp(photo.id)} disabled={isBusy || isFirst} className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-white text-brand-purple-900 text-xs font-black transition-all disabled:opacity-30">
                      ⬆️ Up
                    </button>
                    <button onClick={() => moveDown(photo.id)} disabled={isBusy || isLast} className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-white text-brand-purple-900 text-xs font-black transition-all disabled:opacity-30">
                      ⬇️ Down
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => toggleActive(photo.id, photo.is_active)} disabled={isBusy} className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-brand-purple-950/60 text-white border border-brand-gold-400/40 text-xs font-black transition-all disabled:opacity-50">
                      {photo.is_active ? "🙈 Hide" : "👁️ Show"}
                    </button>
                    <button onClick={() => deletePhoto(photo.id, photo.storage_path)} disabled={isBusy} className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-red-600 text-white text-xs font-black transition-all disabled:opacity-50">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}