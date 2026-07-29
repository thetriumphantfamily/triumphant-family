// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA MATERIALS CLIENT — View & download course materials
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
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

// Get file icon based on type
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
  if (type.includes("zip") || type.includes("rar"))
    return { icon: "🗜️", color: "bg-gray-100 text-gray-600" };

  return { icon: "📄", color: "bg-gray-100 text-gray-600" };
}

// Format file size
function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TDAMaterialsClient() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [studentLevel, setStudentLevel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("all");

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const session = localStorage.getItem("tda_student_session");
      if (!session) return;

      const sessionData = JSON.parse(session);
      setStudentLevel(sessionData.level);

      const supabase = createClient();

      // Load materials for student's level OR general (no level set)
      const { data } = await supabase
        .from("tda_materials")
        .select("*")
        .or(`level.eq.${sessionData.level},level.is.null`)
        .order("module_number", { ascending: true })
        .order("created_at", { ascending: false });

      setMaterials(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  // Get unique module numbers
  const uniqueModules = Array.from(
    new Set(materials.map((m) => m.module_number))
  ).sort((a, b) => a - b);

  // Filter materials
  const filteredMaterials = materials.filter((m) => {
    const matchesModule =
      selectedModule === "all" ||
      m.module_number.toString() === selectedModule;
    const matchesSearch =
      !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description &&
        m.description.toLowerCase().includes(searchQuery.toLowerCase()));

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

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading materials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
          📚 Course Materials
        </h1>
        <p className="text-gray-600 text-sm">
          Download and view learning materials for Level {studentLevel}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md">
        <div className="relative">
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
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
          />
        </div>
      </div>

      {/* Module Filter Tabs */}
      {uniqueModules.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedModule("all")}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              selectedModule === "all"
                ? "bg-brand-purple-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
            }`}
          >
            All Materials
          </button>
          {uniqueModules.map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod.toString())}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                selectedModule === mod.toString()
                  ? "bg-brand-purple-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
              }`}
            >
              Module {mod}
            </button>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">
            Total Materials
          </p>
          <p className="text-3xl font-bold text-brand-purple-900">
            {materials.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">
            Modules
          </p>
          <p className="text-3xl font-bold text-brand-purple-900">
            {uniqueModules.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md col-span-2 lg:col-span-1">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">
            Showing
          </p>
          <p className="text-3xl font-bold text-brand-purple-900">
            {filteredMaterials.length}
          </p>
        </div>
      </div>

      {/* Materials Grid */}
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
            {searchQuery || selectedModule !== "all"
              ? "No materials match your search"
              : "No materials yet"}
          </h3>
          <p className="text-gray-500">
            {searchQuery || selectedModule !== "all"
              ? "Try adjusting your search or filter"
              : "Course materials will appear here once uploaded by your instructor"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((material) => {
            const { icon, color } = getFileIcon(material.file_type);

            return (
              <div
                key={material.id}
                className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md hover:shadow-lg hover:border-brand-purple-300 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* File Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-2xl flex-shrink-0`}
                  >
                    {icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-purple-100 text-brand-purple-700 text-xs font-bold">
                        Module {material.module_number}
                      </span>
                      {material.category && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-gold-100 text-brand-gold-700 text-xs font-bold">
                          {material.category}
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

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                      {material.file_size && (
                        <span>{formatFileSize(material.file_size)}</span>
                      )}
                      <span>•</span>
                      <span>{formatDate(material.created_at)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handleDownload(material.file_url, material.file_name)
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 text-sm font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                          />
                        </svg>
                        Download
                      </button>
                      <a
                        href={material.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-sm font-bold transition-all"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        View
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