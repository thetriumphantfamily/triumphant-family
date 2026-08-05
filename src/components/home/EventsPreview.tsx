// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENTS PREVIEW — Tight spacing + white 3D icons + minimal gold
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// White 3D metallic effect for icons
const ICON_3D_STYLE = {
  color: "#ffffff",
  filter: "drop-shadow(0 2px 0 #e0e0e0) drop-shadow(0 3px 0 #cccccc) drop-shadow(0 4px 6px rgba(0,0,0,0.4)) drop-shadow(0 6px 15px rgba(255,255,255,0.15))",
};

export default async function EventsPreview() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("id, title, slug, description, event_date, location, is_online, online_link, flyer_url, category, registration_required, registration_link")
    .eq("is_published", true)
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(3);

  return (
    <section className="relative pt-8 pb-10 lg:pt-10 lg:pb-12 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">

      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              What&rsquo;s Coming
            </span>
          </div>
        </div>

        {/* Heading — WHITE gradient */}
        <div className="text-center mb-6 lg:mb-8 max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            Upcoming{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
              Events
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            Don&rsquo;t miss these special services, conferences, and programs designed to transform your life.
          </p>

          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Empty state */}
        {(!events || events.length === 0) && (
          <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 rounded-3xl p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            {/* Icon — WHITE 3D metallic */}
            <div className="flex justify-center mb-3" style={ICON_3D_STYLE}>
              <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75" />
              </svg>
            </div>

            <h3 className="font-heading text-xl lg:text-2xl font-bold text-white mb-2">
              Events Coming Soon
            </h3>
            <p className="text-brand-purple-100">
              Check back soon for upcoming services, conferences, and special programs.
            </p>
          </div>
        )}

        {/* Event cards */}
        {events && events.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 max-w-5xl mx-auto">
              {events.map((event) => {
                const eventDate = new Date(event.event_date);
                const day = eventDate.getDate();
                const month = eventDate.toLocaleString("en", { month: "short" }).toUpperCase();
                const year = eventDate.getFullYear();

                const hasRegistration = event.registration_required && event.registration_link;
                const hasOnlineLink   = event.is_online && event.online_link;

                return (
                  <div
                    key={event.id}
                    className="group bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl overflow-hidden border border-brand-gold-400/40 hover:border-brand-gold-400 transition-all duration-300 hover:-translate-y-1 relative flex flex-col max-w-md mx-auto w-full"
                  >
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500 z-10" />

                    {/* Flyer */}
                    <div className="relative w-full bg-brand-purple-950 overflow-hidden flex-shrink-0">
                      {event.flyer_url ? (
                        <img
                          src={event.flyer_url}
                          alt={event.title}
                          loading="lazy"
                          className="w-full h-auto block"
                        />
                      ) : (
                        <div className="w-full aspect-[4/5] flex items-center justify-center bg-gradient-to-br from-brand-purple-700 to-brand-violet-900" style={ICON_3D_STYLE}>
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="p-4 lg:p-5 flex flex-col flex-1">

                      {/* Badges row — WHITE (no gold) */}
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <div className="bg-brand-purple-950/60 border border-white/20 rounded-full px-3 py-1 flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25" />
                          </svg>
                          <span className="text-white text-xs font-bold">
                            {month} {day}, {year}
                          </span>
                        </div>

                        {event.is_online && (
                          <div className="bg-brand-purple-950/60 border border-white/20 rounded-full px-3 py-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span className="text-white text-xs font-bold">Online</span>
                          </div>
                        )}

                        {event.category && (
                          <span className="px-3 py-1 rounded-full bg-brand-purple-950/60 border border-white/20 text-white text-xs font-bold capitalize">
                            {event.category}
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading text-base lg:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-white transition-colors">
                        {event.title}
                      </h3>

                      {event.description && (
                        <p className="text-brand-purple-100 text-sm leading-relaxed line-clamp-2 mb-3 flex-1">
                          {event.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-brand-purple-200 mb-3 pt-3 border-t border-brand-gold-400/30">
                        <svg className="w-3.5 h-3.5 flex-shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <span className="truncate font-medium">
                          {event.is_online ? "Online / Virtual" : (event.location || "Venue TBA")}
                        </span>
                      </div>

                      {/* CTA — WHITE gradient */}
                      {hasRegistration ? (
                        <a
                          href={event.registration_link!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                          Register Now
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                      ) : hasOnlineLink ? (
                        <a
                          href={event.online_link!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                          🌐 Join Online
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          href={`/events/${event.slug}`}
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                          Learn More
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All CTA — WHITE gradient */}
            <div className="flex justify-center">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                View All Events
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        )}

      </div>
    </section>
  );
}