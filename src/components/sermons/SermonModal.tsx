// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERMON MODAL — Embedded video player modal (no YouTube redirect)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect } from "react";

interface Sermon {
  id: string;
  title: string;
  description: string | null;
  preacher: string | null;
  sermon_date: string;
  youtube_url: string | null;
}

interface SermonModalProps {
  sermon: Sermon | null;
  onClose: () => void;
}

// Extract YouTube video ID
function extractYouTubeId(url: string | null): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /youtube\.com\/live\/([^"&?\/\s]{11})/,
    /youtube\.com\/shorts\/([^"&?\/\s]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

// Format date nicely
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function SermonModal({ sermon, onClose }: SermonModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);

    // Prevent body scroll when modal is open
    if (sermon) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [sermon, onClose]);

  if (!sermon) return null;

  const youtubeId = extractYouTubeId(sermon.youtube_url);
  const embedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 animate-fadeIn"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
        <div className="bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl shadow-2xl w-full max-w-5xl my-8 pointer-events-auto max-h-[90vh] overflow-y-auto border-2 border-brand-gold-400/40">
          {/* Gold top bar */}
          <div className="h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500 rounded-t-3xl" />

          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-brand-gold-400/20">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="font-heading text-lg md:text-2xl font-bold text-white line-clamp-2">
                {sermon.title}
              </h2>
              <p className="text-brand-purple-200 text-xs md:text-sm mt-1">
                {sermon.preacher} • {formatDate(sermon.sermon_date)}
              </p>
            </div>
            <button
              onClick={onClose}
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

          {/* Video Player */}
          <div className="p-4 md:p-6">
            {embedUrl ? (
              <div className="aspect-video rounded-2xl overflow-hidden bg-black border-2 border-brand-gold-400/40 shadow-2xl">
                <iframe
                  src={embedUrl}
                  title={sermon.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-video rounded-2xl bg-brand-purple-950 flex items-center justify-center border-2 border-brand-gold-400/40">
                <div className="text-center">
                  <p className="text-white font-semibold mb-2">
                    ⚠️ Video not available
                  </p>
                  <p className="text-brand-purple-200 text-sm">
                    This sermon does not have a valid YouTube URL.
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            {sermon.description && (
              <div className="mt-6 p-5 bg-brand-purple-950/50 rounded-2xl border border-brand-gold-400/30">
                <h3 className="font-heading text-lg font-bold text-brand-gold-400 mb-3">
                  About This Sermon
                </h3>
                <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {sermon.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}