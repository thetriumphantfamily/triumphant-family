// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN MATERIALS CLIENT – Upload, manage, delete + notify students
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";
import { notifyAllTDAStudents } from "@/lib/tda-notifications";

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

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const LEVELS = [
  { value: "", label: "All Levels" },
  { value: "100", label: "Level 100 — Christian Living" },
  { value: "200", label: "Level 200 — Nurturing" },
  { value: "300", label: "Level 300 — Administration" },
  { value: "400", label: "Level 400 — Leadership" },
];

const CATEGORIES = [
  "Study Guide", "PDF Notes", "Presentation", "Audio",
  "Video", "Handout", "Reading Material", "Other",
];

function getFileIcon(fileType: string | null): string {
  if (!fileType) return "📄";
  const type = fileType.toLowerCase();
  if (type.includes("pdf")) return "📕";
  if (type.includes("word") || type.includes("doc")) return "📘";
  if (type.includes("powerpoint") || type.includes("presentation")) return "📙";
  if (type.includes("excel") || type.includes("sheet")) return "📗";
  if (type.includes("audio") || type.includes("mp3")) return "🎵";
  if (type.includes("video") || type.includes("mp4")) return "🎬";
  if (type.includes("image")) return "🖼️";
  return "📄";
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
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
    title: "", description: "", category: "PDF Notes", module_number: 1, level: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => { loadMaterials(); }, []);

  const loadMaterials = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tda_materials").select("*").order("created_at", { ascending: false });
      setMaterials(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) { toast.error("File too large! Max 10 MB"); return; }
    setSelectedFile(file);
    if (!formData.title) setFormData({ ...formData, title: file.name.replace(/\.[^/.]+$/, "") });
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", category: "PDF Notes", module_number: 1, level: "" });
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowForm(false);
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error("Please enter a title"); return; }
    if (!selectedFile) { toast.error("Please select a file"); return; }
    setIsUploading(true);
    try {
      const supabase = createClient();
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `material-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("tda-files").upload(`materials/${fileName}`, selectedFile);
      if (uploadError) { toast.error(`Upload failed: ${uploadError.message}`); setIsUploading(false); return; }
      const { data: { publicUrl } } = supabase.storage.from("tda-files").getPublicUrl(`materials/${fileName}`);
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
      if (dbError) { toast.error(`Save failed: ${dbError.message}`); setIsUploading(false); return; }

      // ✅ NOTIFY ALL STUDENTS
      await notifyAllTDAStudents({
        title: "📚 New Study Material Available",
        message: `"${formData.title.trim()}" has been uploaded. Go to Materials to download it.`,
        type: "material",
        link: "/bible-school/portal/materials",
      });

      toast.success("✅ Material uploaded and students notified!");
      resetForm();
      loadMaterials();
    } catch { toast.error("Something went wrong"); }
    finally { setIsUploading(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tda_materials").delete().eq("id", id);
      if (error) { toast.error("Failed to delete"); setBusyId(null); return; }
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      toast.success("🗑️ Deleted");
    } catch { toast.error("Delete failed"); }
    finally { setBusyId(null); }
  };

  const filteredMaterials = materials.filter((m) => {
    const matchesLevel = !filterLevel || m.level === filterLevel || !m.level;
    const matchesSearch = !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  const stats = {
    total: materials.length,
    withLevel: materials.filter((m) => m.level).length,
    general: materials.filter((m) => !m.level).length,
  };

  if (loading) return <LoadingScreen message="Loading materials..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Page Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Materials</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
            📚 Course Materials
          </h1>
          <p className="text-brand-purple-200 text-sm mb-4">
            Upload materials. Students are notified automatically.
          </p>
          <button onClick={() => setShowForm(true)}
            className="w-full md:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all">
            ➕ Upload Material
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: stats.total },
          { label: "Level-Specific", value: stats.withLevel },
          { label: "General", value: stats.general },
        ].map((s) => (
          <div key={s.label} className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">{s.label}</p>
            <p className="text-white font-black text-3xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Search + Filter ── */}
      <div className="space-y-3">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input type="text" placeholder="Search materials..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
        </div>
        <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold">
          {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
      </div>

      {/* ── Materials List ── */}
      {filteredMaterials.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">📚</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">
            {searchQuery || filterLevel ? "No matching materials" : "No materials uploaded yet"}
          </h3>
          <p className="text-brand-purple-200 text-sm">
            {searchQuery || filterLevel ? "Try different search or filter" : "Click 'Upload Material' to add your first material"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMaterials.map((material) => {
            const icon = getFileIcon(material.file_type);
            const isBusy = busyId === material.id;
            return (
              <div key={material.id} className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center text-2xl flex-shrink-0">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-purple-950/60 text-white text-xs font-black border border-brand-gold-400/40">
                        Module {material.module_number}
                      </span>
                      {material.category && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-purple-950/60 text-white text-xs font-black border border-brand-gold-400/30">
                          {material.category}
                        </span>
                      )}
                      {material.level && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black border border-blue-400/40">
                          Level {material.level}
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-black text-white mb-1 line-clamp-2">{material.title}</h3>
                    {material.description && (
                      <p className="text-brand-purple-200 text-sm line-clamp-2 mb-2">{material.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-brand-purple-200 mb-3">
                      {material.file_size && <span>{formatFileSize(material.file_size)}</span>}
                      {material.file_size && <span>•</span>}
                      <span>{formatDate(material.created_at)}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a href={material.file_url} target="_blank" rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-xl bg-white text-brand-purple-900 text-xs font-black text-center active:scale-95 transition-all">
                        👁️ View Material
                      </a>
                      <button onClick={() => handleDelete(material.id, material.title)} disabled={isBusy}
                        className="w-full py-2.5 rounded-xl bg-red-600 text-white text-xs font-black disabled:opacity-50 active:scale-95 transition-all">
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

      {/* ── Upload Modal ── */}
      {showForm && (
        <>
          <div onClick={resetForm} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-2xl pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">📚 Upload Material</h2>
                  <button onClick={resetForm} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleUpload} className="p-5 space-y-4">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <label className="block text-sm font-bold text-gray-700 mb-3">📎 Select File <span className="text-red-500">*</span></label>
                  <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" id="material-upload" />
                  <label htmlFor="material-upload" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-purple-900 text-white font-black cursor-pointer transition-all active:scale-95">
                    📤 {selectedFile ? "Change File" : "Choose File"}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PDF, Word, PowerPoint, Audio, Video • Max 10 MB</p>
                  {selectedFile && (
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <p className="text-sm text-gray-800 font-semibold">✅ {selectedFile.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Introduction to Prayer" required
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description..." rows={3}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Module Number</label>
                  <input type="number" min="1" value={formData.module_number}
                    onChange={(e) => setFormData({ ...formData, module_number: parseInt(e.target.value) || 1 })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">For Level</label>
                  <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white">
                    <option value="">All Students</option>
                    <option value="100">Level 100 only</option>
                    <option value="200">Level 200 only</option>
                    <option value="300">Level 300 only</option>
                    <option value="400">Level 400 only</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button type="submit" disabled={isUploading || !selectedFile}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                    {isUploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Uploading...
                      </span>
                    ) : "📤 Upload & Notify Students"}
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