// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA MATERIALS CLIENT – View & download course materials
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

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
  if (type.includes("zip") || type.includes("rar")) return "🗜️";
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
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function TDAMaterialsClient() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [studentLevel, setStudentLevel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("all");

  useEffect(() => { loadMaterials(); }, []);

  const loadMaterials = async () => {
    try {
      const session = localStorage.getItem("tda_student_session");
      if (!session) return;
      const sessionData = JSON.parse(session);
      setStudentLevel(sessionData.level);
      const supabase = createClient();
      const { data } = await supabase
        .from("tda_materials")
        .select("*")
        .or(`level.eq.${sessionData.level},level.is.null`)
        .order("module_number", { ascending: true })
        .order("created_at", { ascending: false });
      setMaterials(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const uniqueModules = Array.from(new Set(materials.map((m) => m.module_number))).sort((a, b) => a - b);

  const filteredMaterials = materials.filter((m) => {
    const matchesModule = selectedModule === "all" || m.module_number.toString() === selectedModule;
    const matchesSearch = !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesModule && matchesSearch;
  });

  const handleDownload = (fileUrl: string, fileName: string | null) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "material";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading materials..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Page Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Course Materials</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
            📚 Course Materials
          </h1>
          <p className="text-brand-purple-200 text-sm">
            Download and view learning materials for Level {studentLevel}.
          </p>
          <div className="flex gap-4 flex-wrap pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{materials.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{uniqueModules.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Modules</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{filteredMaterials.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Showing</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
        />
      </div>

      {/* ── Module Filter Tabs ── */}
      {uniqueModules.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedModule("all")}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-black transition-all ${
              selectedModule === "all"
                ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                : "bg-white text-brand-purple-900 font-black"
            }`}
          >
            All Materials
          </button>
          {uniqueModules.map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod.toString())}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-black transition-all ${
                selectedModule === mod.toString()
                  ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                  : "bg-white text-brand-purple-900 font-black"
              }`}
            >
              Module {mod}
            </button>
          ))}
        </div>
      )}

      {/* ── Materials Grid ── */}
      {filteredMaterials.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">📚</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">
            {searchQuery || selectedModule !== "all" ? "No materials match" : "No materials yet"}
          </h3>
          <p className="text-brand-purple-200 text-sm">
            {searchQuery || selectedModule !== "all"
              ? "Try adjusting your search or filter"
              : "Course materials will appear here once uploaded by your instructor"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMaterials.map((material) => {
            const icon = getFileIcon(material.file_type);
            return (
              <div
                key={material.id}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl"
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <div className="flex items-start gap-4">

                  {/* File Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center text-2xl flex-shrink-0">
                    {icon}
                  </div>

                  {/* Content */}
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
                    </div>

                    <h3 className="font-heading font-black text-white mb-1 line-clamp-2">
                      {material.title}
                    </h3>

                    {material.description && (
                      <p className="text-brand-purple-200 text-sm line-clamp-2 mb-2">
                        {material.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-xs text-brand-purple-200 mb-3">
                      {material.file_size && <span>{formatFileSize(material.file_size)}</span>}
                      {material.file_size && <span>•</span>}
                      <span>{formatDate(material.created_at)}</span>
                    </div>

                    {/* Actions — full width mobile */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleDownload(material.file_url, material.file_name)}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
                      >
                        ⬇️ Download
                      </button>
                      <a
                        href={material.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 rounded-xl bg-brand-purple-950/60 text-white font-black border border-brand-gold-400/40 active:scale-95 transition-all text-center"
                      >
                        👁️ View
                      </a>
                    </div>
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