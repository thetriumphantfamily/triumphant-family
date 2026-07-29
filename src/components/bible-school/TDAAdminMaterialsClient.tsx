// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN MATERIALS CLIENT — Upload, manage, delete course materials
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Material {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  module_number: number;
  level: string | null;
  file_url: string;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const LEVELS = [
  { value: "", label: "All Levels" },
  { value: "100", label: "Level 100 — Christian Living" },
  { value: "200", label: "Level 200 — Nurturing" },
  { value: "300", label: "Level 300 — Administration" },
  { value: "400", label: "Level 400 — Leadership" },
];

const CATEGORIES = [
  "Study Guide",
  "PDF Notes",
  "Presentation",
  "Audio",
  "Video",
  "Handout",
  "Reading Material",
  "Other",
];

// Get file icon
function getFileIcon(fileType: string | null): { icon: string; color: string } {
  if (!fileType) return { icon: "📄", color: "bg-gray-100 text-gray-600" };
  const type = fileType.toLowerCase();
  if (type.includes("pdf"))
    return { icon: "📕", color: "bg-red-100 text-red-600" };
  if (type.includes("word") || type.includes("doc"))
    return { icon: "📘", color: "bg-blue-100 text-blue-600" };
  if (type.includes("powerpoint") || type.includes("presentation"))
    return { icon: "📙", color: "bg-orange-100 text-orange-600" };
  if (type.includes("excel") || type.includes("sheet"))
    return { icon: "📗", color: "bg-green-100 text-green-600" };
  if (type.includes("audio") || type.includes("mp3"))
    return { icon: "🎵", color: "bg-purple-100 text-purple-600" };
  if (type.includes("video") || type.includes("mp4"))
    return { icon: "🎬", color: "bg-red-100 text-red-600" };
  if (type.includes("image"))
    return { icon: "🖼️", color: "bg-green-100 text-green-600" };
  return { icon: "📄", color: "bg-gray-100 text-gray-600" };
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TDAAdminMaterialsClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [filterLevel, setFilterLevel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "PDF Notes",
    module_number: 1,
    level: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tda_materials")
        .select("*")
        .order("created_at", { ascending: false });

      setMaterials(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large! Max 10 MB");
      return;
    }

    setSelectedFile(file);
    // Auto-fill title if empty
    if (!formData.title) {
      setFormData({
        ...formData,
        title: file.name.replace(/\.[^/.]+$/, ""),
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "PDF Notes",
      module_number: 1,
      level: "",
    });
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowForm(false);
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);

    try {
      const supabase = createClient();

      // Upload file
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `material-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("tda-files")
        .upload(`materials/${fileName}`, selectedFile);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error(`Upload failed: ${uploadError.message}`);
        setIsUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("tda-files").getPublicUrl(`materials/${fileName}`);

      // Insert record
      const { error: dbError } = await supabase.from("tda_materials").insert({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: formData.category,
        module_number: formData.module_number,
        level: formData.level || null,
        file_url: publicUrl,
        file_name: selectedFile.name,
        file_type: selectedFile.type,
        file_size: selectedFile.size,
        uploaded_by: "Admin",
      });

      if (dbError) {
        console.error("DB error:", dbError);
        toast.error(`Save failed: ${dbError.message}`);
        setIsUploading(false);
        return;
      }

      toast.success("✅ Material uploaded!");
      resetForm();
      loadMaterials();
      setIsUploading(false);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong");
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;

    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("tda_materials")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("Failed to delete");
        setBusyId(null);
        return;
      }

      setMaterials((prev) => prev.filter((m) => m.id !== id));
      toast.success("🗑️ Deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  // Filter materials
  const filteredMaterials = materials.filter((m) => {
    const matchesLevel = !filterLevel || m.level === filterLevel || !m.level;
    const matchesSearch =
      !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description &&
        m.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesLevel && matchesSearch;
  });

  const stats = {
    total: materials.length,
    withLevel: materials.filter((m) => m.level).length,
    generalMaterials: materials.filter((m) => !m.level).length,
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading materials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
            📚 Course Materials
          </h1>
          <p className="text-gray-600 text-sm">
            Upload and manage learning materials for students
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
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
          Upload Material
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
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
            Level-Specific
          </p>
          <p className="text-3xl font-bold text-brand-purple-900">
            {stats.withLevel}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
            General
          </p>
          <p className="text-3xl font-bold text-brand-purple-900">
            {stats.generalMaterials}
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
          />
        </div>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
        >
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* Materials List */}
      {filteredMaterials.length === 0 ? (
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
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            {searchQuery || filterLevel
              ? "No matching materials"
              : "No materials uploaded yet"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterLevel
              ? "Try different search or filter"
              : "Click 'Upload Material' to add your first material"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((material) => {
            const { icon, color } = getFileIcon(material.file_type);
            const isBusy = busyId === material.id;

            return (
              <div
                key={material.id}
                className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-2xl flex-shrink-0`}
                  >
                    {icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-purple-100 text-brand-purple-700 text-xs font-bold">
                        Module {material.module_number}
                      </span>
                      {material.category && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-gold-100 text-brand-gold-700 text-xs font-bold">
                          {material.category}
                        </span>
                      )}
                      {material.level && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                          Level {material.level}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-bold text-brand-purple-900 mb-1 line-clamp-2">
                      {material.title}
                    </h3>

                    {material.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {material.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                      {material.file_size && (
                        <span>{formatFileSize(material.file_size)}</span>
                      )}
                      <span>•</span>
                      <span>{formatDate(material.created_at)}</span>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={material.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-sm font-bold transition-all"
                      >
                        👁️ View
                      </a>
                      <button
                        onClick={() => handleDelete(material.id, material.title)}
                        disabled={isBusy}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700 text-sm font-bold transition-all disabled:opacity-50"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ━━━ UPLOAD MODAL ━━━ */}
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
                      📚 Upload Material
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Add a new learning resource for students
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

              <form onSubmit={handleUpload} className="p-6 space-y-5">
                {/* File Upload */}
                <div className="bg-brand-purple-50 rounded-2xl p-5 border-2 border-brand-purple-100">
                  <label className="block text-sm font-bold text-brand-purple-900 mb-3">
                    📎 Select File <span className="text-red-500">*</span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="material-upload"
                  />

                  <label
                    htmlFor="material-upload"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-bold cursor-pointer transition-all"
                  >
                    <svg
                      className="w-5 h-5"
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
                    {selectedFile ? "Change File" : "Choose File"}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    📎 PDF, Word, PowerPoint, Audio, Video • Max 10 MB
                  </p>

                  {selectedFile && (
                    <div className="mt-3 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                      <p className="text-sm text-green-700 font-semibold">
                        ✅ {selectedFile.name}
                      </p>
                      <p className="text-xs text-green-600 mt-0.5">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Title */}
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
                    placeholder="e.g. Introduction to Prayer"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description..."
                    rows={3}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Module Number */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Module #
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.module_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          module_number: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                    />
                  </div>

                  {/* Level */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      For Level
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
                </div>

                {/* Actions */}
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
                    disabled={isUploading || !selectedFile}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
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
                      <>📤 Upload Material</>
                    )}
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