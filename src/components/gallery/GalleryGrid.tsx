// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GALLERY GRID — Public gallery with category filters + lightbox
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import Image from "next/image";

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
  service: "✝️ Service",
  general: "📸 General",
};

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  // Get unique categories from items
  const uniqueCategories = Array.from(
    new Set(items.map((item) => item.category).filter(Boolean))
  ) as string[];

  // Filter items
  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  if (items.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-md mx-auto text-center">
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
            <h2 className="font-heading text-2xl font-bold text-brand-purple-900 mb-2">
              Gallery Coming Soon
            </h2>
            <p className="text-gray-600">
              Photos from our ministry services and events will be posted here
              soon. Check back regularly!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-custom">
          {/* Category Filters */}
          {uniqueCategories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-br from-brand-purple-600 to-brand-purple-700 text-white shadow-brand"
                    : "bg-white text-gray-600 border-2 border-gray-200 hover:border-brand-purple-300"
                }`}
              >
                📸 All Photos
              </button>
              {uniqueCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                    selectedCategory === cat
                      ? "bg-gradient-to-br from-brand-purple-600 to-brand-purple-700 text-white shadow-brand"
                      : "bg-white text-gray-600 border-2 border-gray-200 hover:border-brand-purple-300"
                  }`}
                >
                  {CATEGORY_LABELS[cat] || cat}
                </button>
              ))}
            </div>
          )}

          {/* Photo grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setLightboxImage(item)}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-gray-100"
              >
                <Image
                  src={item.image_url}
                  alt={item.title || "Gallery"}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-900/90 via-brand-purple-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-left">
                    {item.title && (
                      <p className="text-white font-bold text-sm mb-1 line-clamp-2">
                        {item.title}
                      </p>
                    )}
                    {item.category && (
                      <span className="text-brand-gold-400 text-xs font-semibold">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Zoom icon */}
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-4 h-4 text-brand-purple-900"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No photos in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out animate-fade-in"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all z-10"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl max-h-full flex flex-col items-center"
          >
            <div className="relative w-full h-full max-h-[80vh] max-w-full aspect-video">
              <Image
                src={lightboxImage.image_url}
                alt={lightboxImage.title || "Gallery"}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Caption */}
            {(lightboxImage.title || lightboxImage.description) && (
              <div className="mt-4 text-center max-w-2xl px-4">
                {lightboxImage.title && (
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-1">
                    {lightboxImage.title}
                  </h3>
                )}
                {lightboxImage.description && (
                  <p className="text-brand-purple-200 text-sm md:text-base">
                    {lightboxImage.description}
                  </p>
                )}
                {lightboxImage.category && (
                  <span className="inline-block mt-3 px-3 py-1 rounded-full bg-brand-gold-400 text-brand-purple-900 text-xs font-bold">
                    {CATEGORY_LABELS[lightboxImage.category] ||
                      lightboxImage.category}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}