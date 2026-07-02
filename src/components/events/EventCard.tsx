// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENT CARD — Full flyer display + smart CTAs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    event_date: string;
    location?: string | null;
    is_online?: boolean;
    online_link?: string | null;
    flyer_url?: string | null;
    category?: string | null;
    registration_required?: boolean;
    registration_link?: string | null;
  };
  variant?: "upcoming" | "past";
}

// ── Category color mapping ──
const CATEGORY_COLORS: Record<
  string,
  "purple" | "gold" | "green" | "red" | "blue" | "gray"
> = {
  service: "purple",
  conference: "gold",
  crusade: "red",
  prayer: "blue",
  outreach: "green",
  training: "gray",
  fellowship: "purple",
  other: "gray",
};

export default function EventCard({
  event,
  variant = "upcoming",
}: EventCardProps) {
  const eventDate = new Date(event.event_date);
  const day = eventDate.getDate();
  const month = eventDate
    .toLocaleString("en", { month: "short" })
    .toUpperCase();
  const year = eventDate.getFullYear();
  const isPast = variant === "past";

  // ── Determine which CTA to show ──
  const hasRegistration =
    event.registration_required && event.registration_link;
  const hasOnlineLink = event.is_online && event.online_link;

  return (
    <div
      className={`group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col ${
        isPast ? "opacity-90" : ""
      }`}
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* FULL FLYER DISPLAY (object-contain, dark background)         */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative w-full bg-gradient-to-br from-brand-violet-900 to-brand-purple-900 overflow-hidden flex-shrink-0">
        {event.flyer_url ? (
          <div className="relative w-full" style={{ paddingBottom: "125%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.flyer_url}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="relative w-full aspect-[4/5] flex items-center justify-center">
            <svg
              className="w-24 h-24 text-white/20"
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75"
              />
            </svg>
          </div>
        )}

        {/* Date badge (top-left) */}
        <div className="absolute top-4 left-4 bg-white rounded-2xl px-4 py-2.5 text-center shadow-xl min-w-[64px]">
          <p className="text-brand-purple-700 text-xs font-bold uppercase">
            {month}
          </p>
          <p className="text-brand-purple-900 text-2xl font-heading font-bold leading-none">
            {day}
          </p>
          <p className="text-gray-400 text-[10px] mt-0.5">{year}</p>
        </div>

        {/* Online badge (top-right) */}
        {event.is_online && !isPast && (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Online
          </div>
        )}

        {/* Past badge (top-right) */}
        {isPast && (
          <div className="absolute top-4 right-4 bg-gray-700 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            Past Event
          </div>
        )}

        {/* Gradient overlay for past events */}
        {isPast && (
          <div className="absolute inset-0 bg-gray-900/30 pointer-events-none" />
        )}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* CONTENT (below the flyer)                                    */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="p-6 flex flex-col flex-1">
        {/* Category badge */}
        {event.category && (
          <Badge
            variant={CATEGORY_COLORS[event.category] || "gray"}
            size="sm"
            className="mb-3 w-fit capitalize"
          >
            {event.category}
          </Badge>
        )}

        {/* Title */}
        <h3 className="font-heading text-lg font-bold text-brand-purple-900 mb-2 line-clamp-2 group-hover:text-brand-purple-600 transition-colors">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
            {event.description}
          </p>
        )}

        {/* Meta info */}
        <div className="space-y-2 text-xs text-gray-600 mb-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 flex-shrink-0 text-brand-purple-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">{formatDate(event.event_date)}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 flex-shrink-0 text-brand-purple-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <span className="truncate font-medium">
              {event.is_online
                ? "Online / Virtual"
                : event.location || "Venue TBA"}
            </span>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* SMART CTA (only if there's a real destination)               */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {isPast ? (
          // PAST EVENTS: no CTA, just a badge
          <div className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 text-gray-500 font-semibold text-sm">
            ✓ Completed
          </div>
        ) : hasRegistration ? (
          // REGISTRATION LINK: opens external form
          <a
            href={event.registration_link!}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-sm hover:scale-105 transition-all duration-300 shadow-gold"
          >
            Register Now
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        ) : hasOnlineLink ? (
          // ONLINE LINK: opens external stream
          <a
            href={event.online_link!}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-purple-600 to-brand-purple-700 text-white font-bold text-sm hover:scale-105 transition-all duration-300 shadow-brand"
          >
            🌐 Join Online
          </a>
        ) : (
          // NO LINK: just show "Save the Date" badge
          <div className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-brand-purple-50 text-brand-purple-700 font-semibold text-sm border-2 border-brand-purple-100">
            📌 Save the Date
          </div>
        )}
      </div>
    </div>
  );
}