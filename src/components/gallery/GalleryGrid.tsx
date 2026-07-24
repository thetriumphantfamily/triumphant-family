// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GALLERY GRID — Category filters + lightbox with title & description
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState, useEffect } from "react";

interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  category: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  worship: "🎵 Worship",
  prayer: "🙏 Prayer",
  event: "📅 Event",
  ministry: "⛪ Ministry",
  outreach: "🌍 Outreach",
  service: "✨ Service",
  general: "📸 General",
};

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  const uniqueCategories = Array.from(
    new Set(items.map((item) => item.category).filter(Boolean))
  ) as string[];

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  // Close lightbox on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    window.addEventListener("keydown", handleEsc);

    if (lightboxImage) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [lightboxImage]);

  return (
    <>
      <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
        <div className="relative z-10 container-custom">
          {/* Category filters */}
          {uniqueCategories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                    : "bg-brand-purple-950/60 text-white border border-brand-gold-400/40 hover:border-brand-gold-400"
                }`}
              >
                All Photos
              </button>
              {uniqueCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                      : "bg-brand-purple-950/60 text-white border border-brand-gold-400/40 hover:border-brand-gold-400"
                  }`}
                >
                  {CATEGORY_LABELS[cat] || cat}
                </button>
              ))}
            </div>
          )}

          {/* Photo count */}
          <p className="text-center text-brand-purple-200 text-sm mb-6">
            Showing{" "}
            <strong className="text-brand-gold-400">
              {filteredItems.length}
            </strong>{" "}
            {filteredItems.length === 1 ? "photo" : "photos"}
          </p>

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="max-w-md mx-auto text-center bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 rounded-3xl p-10 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-4">
                <svg
                  className="w-8 h-8 text-brand-purple-900"
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
              <h3 className="font-heading text-xl font-bold text-white mb-2">
                No photos in this category
              </h3>
              <p className="text-brand-purple-100 text-sm">
                Try selecting a different category
              </p>
            </div>
          )}

          {/* Photo grid */}
          {filteredItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLightboxImage(item)}
                  className="group relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl overflow-hidden border-2 border-brand-gold-400/40 hover:border-brand-gold-400 hover:shadow-[0_0_25px_rgba(255,199,44,0.25)] transition-all duration-300 hover:-translate-y-1 text-left cursor-pointer"
                >
                  {/* Gold top bar */}
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500 z-10" />

                  {/* Photo */}
                  <div className="relative aspect-square bg-brand-purple-950 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url}
                      alt={item.title || "Gallery photo"}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Category badge on photo */}
                    {item.category && (
                      <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-brand-purple-900/80 border border-brand-gold-400/40 text-brand-gold-300 text-xs font-bold">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </div>
                    )}

                    {/* Zoom icon on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-purple-900/40">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
                        <svg
                          className="w-7 h-7 text-brand-purple-900"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Title and description below photo */}
                  {(item.title || item.description) && (
                    <div className="p-4">
                      {item.title && (
                        <h3 className="font-heading text-base lg:text-lg font-bold text-white mb-1 line-clamp-2 group-hover:text-brand-gold-400 transition-colors">
                          {item.title}
                        </h3>
                      )}
                      {item.description && (
                        <p className="text-brand-purple-100 text-xs lg:text-sm leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <>
          <div
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] pointer-events-auto overflow-hidden border-2 border-brand-gold-400/40 flex flex-col">
              {/* Gold top bar */}
              <div className="h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-brand-gold-400/20">
                <div className="flex-1 min-w-0 pr-4">
                  {lightboxImage.title && (
                    <h2 className="font-heading text-lg md:text-2xl font-bold text-white line-clamp-2">
                      {lightboxImage.title}
                    </h2>
                  )}
                  {lightboxImage.category && (
                    <p className="text-brand-gold-400 text-xs md:text-sm mt-1">
                      {CATEGORY_LABELS[lightboxImage.category] ||
                        lightboxImage.category}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setLightboxImage(null)}
                  className="w-10 h-10 rounded-full bg-brand-gold-400 hover:bg-brand-gold-500 flex items-center justify-center transition-all hover:scale-110 flex-shrink-0"
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5 text-brand-purple-900"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
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

              {/* Photo */}
              <div className="flex-1 overflow-auto p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightboxImage.image_url}
                  alt={lightboxImage.title || "Gallery"}
                  className="w-full h-auto rounded-xl border border-brand-gold-400/30"
                />

                {/* Description */}
                {lightboxImage.description && (
                  <div className="mt-4 p-4 bg-brand-purple-950/50 rounded-xl border border-brand-gold-400/30">
                    <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed whitespace-pre-line">
                      {lightboxImage.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}