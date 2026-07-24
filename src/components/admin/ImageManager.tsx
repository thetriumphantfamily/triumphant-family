// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IMAGE MANAGER — Upload, view, reorder, and delete hero photos
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function ImageManager({
  initialPhotos,
}: {
  initialPhotos: HeroPhoto[];
}) {
  const router = useRouter();
  const [photos, setPhotos] = useState<HeroPhoto[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ━━━ Upload photo ━━━
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large! Max size is 5 MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("hero-photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error(`Upload failed: ${uploadError.message}`);
        setUploading(false);
        return;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("hero-photos").getPublicUrl(filePath);

      // Save to database
      const nextPosition = photos.length > 0
        ? Math.max(...photos.map((p) => p.position)) + 1
        : 0;

      const { data: newPhoto, error: dbError } = await supabase
        .from("hero_photos")
        .insert({
          url: publicUrl,
          storage_path: filePath,
          position: nextPosition,
          is_active: true,
        })
        .select()
        .single();

      if (dbError) {
        console.error("Database error:", dbError);
        toast.error(`Database error: ${dbError.message}`);
        setUploading(false);
        return;
      }

      // Add to state
      setPhotos((prev) => [...prev, newPhoto as HeroPhoto]);
      toast.success("🎉 Photo uploaded!");
      router.refresh();

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  // ━━━ Toggle active status ━━━
  const toggleActive = async (id: string, current: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("hero_photos")
        .update({ is_active: !current })
        .eq("id", id);

      if (error) throw error;

      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p))
      );
      toast.success(current ? "Hidden from site" : "✅ Now visible!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update");
    } finally {
      setBusyId(null);
    }
  };

  // ━━━ Move photo up ━━━
  const moveUp = async (id: string) => {
    const currentIndex = photos.findIndex((p) => p.id === id);
    if (currentIndex <= 0) return;

    setBusyId(id);
    try {
      const supabase = createClient();
      const current = photos[currentIndex];
      const above = photos[currentIndex - 1];

      // Swap positions
      await supabase
        .from("hero_photos")
        .update({ position: above.position })
        .eq("id", current.id);

      await supabase
        .from("hero_photos")
        .update({ position: current.position })
        .eq("id", above.id);

      // Update state
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

  // ━━━ Move photo down ━━━
  const moveDown = async (id: string) => {
    const currentIndex = photos.findIndex((p) => p.id === id);
    if (currentIndex >= photos.length - 1) return;

    setBusyId(id);
    try {
      const supabase = createClient();
      const current = photos[currentIndex];
      const below = photos[currentIndex + 1];

      // Swap positions
      await supabase
        .from("hero_photos")
        .update({ position: below.position })
        .eq("id", current.id);

      await supabase
        .from("hero_photos")
        .update({ position: current.position })
        .eq("id", below.id);

      // Update state
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

  // ━━━ Delete photo ━━━
  const deletePhoto = async (id: string, storagePath: string) => {
    if (!confirm("Delete this photo permanently?\n\nThis cannot be undone.")) return;

    setBusyId(id);
    try {
      const supabase = createClient();

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("hero-photos")
        .remove([storagePath]);

      if (storageError) {
        console.warn("Storage delete warning:", storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("hero_photos")
        .delete()
        .eq("id", id);

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
      <div className="mb-6 bg-white rounded-3xl border-2 border-gray-100 shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
            <svg
              className="w-6 h-6 text-brand-purple-900"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-brand-purple-900">
              Upload New Photo
            </h2>
            <p className="text-gray-500 text-sm">
              JPG, PNG, WEBP • Max 5 MB per file
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
          id="photo-upload"
        />

        <label
          htmlFor="photo-upload"
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold cursor-pointer transition-all ${
            uploading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold hover:shadow-gold-lg hover:scale-105"
          }`}
        >
          {uploading ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Uploading...
            </>
          ) : (
            <>
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
              📸 Choose Photo to Upload
            </>
          )}
        </label>
      </div>

      {/* Empty state */}
      {photos.length === 0 && (
        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md p-10 text-center">
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
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <h3 className="font-heading text-2xl font-bold text-brand-purple-900 mb-2">
            No photos yet
          </h3>
          <p className="text-gray-500 mb-6">
            Upload your first hero photo to get started!
          </p>
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
                className={`bg-white rounded-2xl border-2 shadow-md overflow-hidden transition-all ${
                  photo.is_active
                    ? "border-green-200"
                    : "border-gray-200 opacity-60"
                }`}
              >
                {/* Photo */}
                <div className="relative aspect-video bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt="Hero photo"
                    className="w-full h-full object-cover"
                  />

                  {/* Position badge */}
                  <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-brand-purple-900/80 text-white text-xs font-bold shadow-md">
                    #{index + 1}
                  </div>

                  {/* Active/Inactive badge */}
                  <div
                    className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                      photo.is_active
                        ? "bg-green-500 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {photo.is_active ? "✅ Active" : "🙈 Hidden"}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {/* Move up */}
                    <button
                      onClick={() => moveUp(photo.id)}
                      disabled={isBusy || isFirst}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ⬆️ Up
                    </button>

                    {/* Move down */}
                    <button
                      onClick={() => moveDown(photo.id)}
                      disabled={isBusy || isLast}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ⬇️ Down
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Toggle active */}
                    <button
                      onClick={() => toggleActive(photo.id, photo.is_active)}
                      disabled={isBusy}
                      className={`inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full text-xs font-bold transition-all disabled:opacity-50 ${
                        photo.is_active
                          ? "bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700"
                          : "bg-green-100 hover:bg-green-200 border-2 border-green-300 text-green-700"
                      }`}
                    >
                      {photo.is_active ? "🙈 Hide" : "👁️ Show"}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deletePhoto(photo.id, photo.storage_path)}
                      disabled={isBusy}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-white hover:bg-red-50 border-2 border-red-200 text-red-600 text-xs font-bold transition-all disabled:opacity-50"
                    >
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