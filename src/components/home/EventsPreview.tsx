// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENTS PREVIEW — Flyer fully visible, all text BELOW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

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
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-gold-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-brand-magenta-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 container-custom">

        {/* Top center: Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              What&rsquo;s Coming
            </span>
          </div>
        </div>

        {/* Center heading */}
        <div className="text-center mb-8 lg:mb-10 max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            Upcoming{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Events
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            Don&rsquo;t miss these special services, conferences, and programs designed to transform your life.
          </p>

          {/* Gold divider */}
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* No events yet */}
        {(!events || events.length === 0) && (
          <div className="max-w-2xl mx-auto text-center bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-3xl p-10 lg:p-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-4">
              <svg className="w-10 h-10 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75"/>
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

        {/* Event cards — FLYER FULLY VISIBLE, TEXT BELOW */}
        {events && events.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
              {events.map((event) => {
                const eventDate = new Date(event.event_date);
                const day = eventDate.getDate();
                const month = eventDate.toLocaleString("en", { month: "short" }).toUpperCase();
                const year = eventDate.getFullYear();

                const hasRegistration = event.registration_required && event.registration_link;
                const hasOnlineLink = event.is_online && event.online_link;

                return (
                  <div
                    key={event.id}
                    className="group bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border-2 border-white/20 hover:border-brand-gold-400/60 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 relative flex flex-col"
                  >
                    {/* Gold top bar */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500 z-10" />

                    {/* FLYER — FULL DISPLAY (no badges on top) */}
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
                          <svg className="w-20 h-20 text-white/30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* ALL CONTENT BELOW FLYER */}
                    <div className="p-5 lg:p-6 flex flex-col flex-1">

                      {/* Date + Online + Category badges row */}
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        {/* Date badge */}
                        <div className="bg-brand-gold-400/20 border border-brand-gold-400/40 rounded-full px-3 py-1 text-center flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-brand-gold-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25"/>
                          </svg>
                          <span className="text-brand-gold-300 text-xs font-bold">
                            {month} {day}, {year}
                          </span>
                        </div>

                        {/* Online badge */}
                        {event.is_online && (
                          <div className="bg-brand-gold-400/20 border border-brand-gold-400/40 rounded-full px-3 py-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-400 animate-pulse" />
                            <span className="text-brand-gold-300 text-xs font-bold">Online</span>
                          </div>
                        )}

                        {/* Category */}
                        {event.category && (
                          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold capitalize">
                            {event.category}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-lg lg:text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-brand-gold-400 transition-colors">
                        {event.title}
                      </h3>

                      {/* Description */}
                      {event.description && (
                        <p className="text-brand-purple-100 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                          {event.description}
                        </p>
                      )}

                      {/* Location */}
                      <div className="flex items-center gap-2 text-xs text-brand-purple-200 mb-4 pt-3 border-t border-white/10">
                        <svg className="w-3.5 h-3.5 flex-shrink-0 text-brand-gold-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                        </svg>
                        <span className="truncate font-medium">
                          {event.is_online ? "Online / Virtual" : (event.location || "Venue TBA")}
                        </span>
                      </div>

                      {/* Smart CTA */}
                      {hasRegistration ? (
                        <a
                          href={event.registration_link!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-sm hover:shadow-gold-lg hover:scale-105 transition-all duration-300 shadow-gold"
                        >
                          Register Now
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                          </svg>
                        </a>
                      ) : hasOnlineLink ? (
                        <a
                          href={event.online_link!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/40 text-white font-bold text-sm hover:bg-white/20 hover:border-white transition-all duration-300"
                        >
                          🌐 Join Online
                        </a>
                      ) : (
                        <div className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-brand-gold-400/10 border-2 border-brand-gold-400/30 text-brand-gold-300 font-semibold text-sm">
                          📌 Save the Date
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View all CTA */}
            <div className="flex justify-center">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-base shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
              >
                View All Events
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </div>
          </>
        )}

      </div>
    </section>
  );
}