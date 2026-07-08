// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENT CARD — Full flyer + purple gradient + gold accents
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
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

export default function EventCard({
  event,
  variant = "upcoming",
}: EventCardProps) {
  const eventDate = new Date(event.event_date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString("en", { month: "short" }).toUpperCase();
  const year = eventDate.getFullYear();
  const isPast = variant === "past";

  const hasRegistration = event.registration_required && event.registration_link;
  const hasOnlineLink   = event.is_online && event.online_link;

  return (
    <div
      className={`group relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl overflow-hidden border border-brand-gold-400/40 hover:border-brand-gold-400 hover:shadow-[0_0_25px_rgba(255,199,44,0.25)] transition-all duration-300 hover:-translate-y-0.5 flex flex-col ${
        isPast ? "opacity-80" : ""
      }`}
    >
      {/* Gold top bar */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500 z-10" />

      {/* FLYER — full display */}
      <div className="relative w-full bg-brand-purple-900 overflow-hidden flex-shrink-0">
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
          <div className="relative w-full aspect-[4/5] flex items-center justify-center bg-gradient-to-br from-brand-purple-700 to-brand-violet-900">
            <svg className="w-20 h-20 text-brand-gold-400/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75" />
            </svg>
          </div>
        )}

        {/* Date badge (top-left) — gold themed */}
        <div className="absolute top-4 left-4 bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 rounded-xl px-3 py-2 text-center shadow-gold min-w-[60px]">
          <p className="text-brand-purple-900 text-[10px] font-bold uppercase">
            {month}
          </p>
          <p className="text-brand-purple-900 text-xl font-heading font-bold leading-none">
            {day}
          </p>
          <p className="text-brand-purple-800 text-[9px] mt-0.5">{year}</p>
        </div>

        {/* Online badge (top-right) */}
        {event.is_online && !isPast && (
          <div className="absolute top-4 right-4 bg-brand-gold-400/90 border border-brand-gold-400 text-brand-purple-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-900 animate-pulse" />
            Online
          </div>
        )}

        {/* Past badge (top-right) */}
        {isPast && (
          <div className="absolute top-4 right-4 bg-brand-purple-900/90 border border-brand-gold-400/40 text-brand-gold-300 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm">
            Past Event
          </div>
        )}
      </div>

      {/* CONTENT below flyer */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category badge */}
        {event.category && (
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-gold-400/15 border border-brand-gold-400/40 text-brand-gold-300 text-[10px] font-bold uppercase tracking-wider mb-3 w-fit capitalize">
            {event.category}
          </span>
        )}

        {/* Title */}
        <h3 className="font-heading text-base lg:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-brand-gold-400 transition-colors">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-brand-purple-100 text-xs lg:text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
            {event.description}
          </p>
        )}

        {/* Meta info */}
        <div className="space-y-2 text-xs text-brand-purple-200 mb-4 pt-3 border-t border-brand-gold-400/30">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0 text-brand-gold-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{formatDate(event.event_date)}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0 text-brand-gold-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="truncate font-medium">
              {event.is_online ? "Online / Virtual" : event.location || "Venue TBA"}
            </span>
          </div>
        </div>

        {/* Smart CTA */}
        {isPast ? (
          <div className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-brand-purple-900/50 border border-brand-gold-400/30 text-brand-purple-200 font-semibold text-xs">
            ✓ Completed
          </div>
        ) : hasRegistration ? (
          <a
            href={event.registration_link!}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-xs shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
          >
            Register Now
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        ) : hasOnlineLink ? (
          <a
            href={event.online_link!}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-xs shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
          >
            🌐 Join Online
          </a>
        ) : (
          <Link
            href={`/events/${event.slug}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-xs shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
          >
            View Details
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}