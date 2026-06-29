// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENTS PREVIEW — Upcoming 3 events from Supabase
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { createClient }    from "@/lib/supabase/server";
import SectionHeading      from "@/components/ui/SectionHeading";
import EmptyState          from "@/components/ui/EmptyState";
import Badge               from "@/components/ui/Badge";
import { formatDate }      from "@/lib/utils";

// ── Category badge colour map ──
const CATEGORY_COLORS: Record<string, "purple" | "gold" | "green" | "red" | "blue" | "gray"> = {
  service:     "purple",
  conference:  "gold",
  crusade:     "red",
  prayer:      "blue",
  outreach:    "green",
  training:    "gray",
  fellowship:  "purple",
  other:       "gray",
};

export default async function EventsPreview() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("id, title, slug, description, event_date, location, is_online, flyer_url, category, registration_required, registration_link")
    .eq("is_published", true)
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(3);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <SectionHeading
            badge="What's Coming"
            title={
              <>
                Upcoming{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                  Events
                </span>
              </>
            }
            subtitle="Don't miss these special services, conferences, and programs designed to transform your life."
            align="left"
            withDivider
          />
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-brand-purple-200 text-brand-purple-700 font-semibold text-sm hover:bg-brand-purple-50 transition-all duration-300 flex-shrink-0"
          >
            All Events
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>

        {/* No events yet */}
        {(!events || events.length === 0) && (
          <EmptyState
            icon={
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"/>
              </svg>
            }
            title="Events Coming Soon"
            description="Check back soon for upcoming services, conferences, and special programs."
          />
        )}

        {/* Event cards */}
        {events && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const eventDate = new Date(event.event_date);
              const day       = eventDate.getDate();
              const month     = eventDate.toLocaleString("en", { month: "short" }).toUpperCase();

              return (
                <div
                  key={event.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
                >
                  {/* Flyer or Gradient Header */}
                  <div className="relative w-full h-44 bg-gradient-to-br from-brand-purple-600 to-brand-violet-900 overflow-hidden flex-shrink-0">
                    {event.flyer_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={event.flyer_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"/>
                        </svg>
                      </div>
                    )}

                    {/* Date badge */}
                    <div className="absolute top-4 left-4 bg-white rounded-2xl px-3 py-2 text-center shadow-md">
                      <p className="text-brand-purple-700 text-xs font-bold uppercase">{month}</p>
                      <p className="text-brand-purple-900 text-2xl font-heading font-bold leading-none">{day}</p>
                    </div>

                    {/* Online badge */}
                    {event.is_online && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Online
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {event.category && (
                      <Badge
                        variant={CATEGORY_COLORS[event.category] || "gray"}
                        size="sm"
                        className="mb-3 capitalize"
                      >
                        {event.category}
                      </Badge>
                    )}

                    <h3 className="font-heading text-lg font-bold text-brand-purple-900 mb-2 line-clamp-2 group-hover:text-brand-purple-600 transition-colors">
                      {event.title}
                    </h3>

                    {event.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                        {event.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 pt-3 border-t border-gray-100">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                      </svg>
                      <span className="truncate">{event.is_online ? "Online / Virtual" : (event.location || "TBA")}</span>
                      <span className="ml-auto flex-shrink-0">{formatDate(event.event_date)}</span>
                    </div>

                    {/* CTA */}
                    {event.registration_required && event.registration_link ? (
                      <a
                        href={event.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-brand-gold-400 text-brand-purple-900 font-bold text-sm hover:scale-105 transition-all duration-300 shadow-gold"
                      >
                        Register Now
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                      </a>
                    ) : (
                      <Link
                        href={`/events/${event.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border-2 border-brand-purple-200 text-brand-purple-700 font-semibold text-sm hover:bg-brand-purple-50 transition-all duration-300"
                      >
                        Learn More
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}