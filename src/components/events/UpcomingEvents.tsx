// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UPCOMING EVENTS — Future events grid
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";
import SectionHeading   from "@/components/ui/SectionHeading";
import EmptyState       from "@/components/ui/EmptyState";
import EventCard        from "@/components/events/EventCard";

export default async function UpcomingEvents() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("id, title, slug, description, event_date, location, is_online, flyer_url, category, registration_required, registration_link")
    .eq("is_published", true)
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true });

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">

        {/* Heading */}
        <div className="mb-12">
          <SectionHeading
            badge="Upcoming"
            title={
              <>
                What&rsquo;s{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                  Coming Up
                </span>
              </>
            }
            subtitle="Plan ahead and join us for these special services and programs."
            withDivider
          />
        </div>

        {/* No upcoming events */}
        {(!events || events.length === 0) && (
          <EmptyState
            icon={
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25" />
              </svg>
            }
            title="No Upcoming Events Yet"
            description="We are preparing exciting events. In the meantime, join our weekly services every Sunday and Wednesday."
            actionLabel="View Service Times"
            actionHref="/about"
          />
        )}

        {/* Event cards */}
        {events && events.length > 0 && (
          <>
            <p className="text-center text-gray-500 text-sm mb-8">
              <strong className="text-brand-purple-700">{events.length}</strong>{" "}
              {events.length === 1 ? "event" : "events"} coming up
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {events.map((event) => (
                <EventCard key={event.id} event={event} variant="upcoming" />
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}