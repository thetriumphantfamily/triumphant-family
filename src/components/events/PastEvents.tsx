// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAST EVENTS — Archive of past events
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";
import SectionHeading   from "@/components/ui/SectionHeading";
import EventCard        from "@/components/events/EventCard";

export default async function PastEvents() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("id, title, slug, description, event_date, location, is_online, flyer_url, category, registration_required, registration_link")
    .eq("is_published", true)
    .lt("event_date", new Date().toISOString())
    .order("event_date", { ascending: false })
    .limit(6);

  // Don't render section if no past events
  if (!events || events.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">

        {/* Heading */}
        <div className="mb-12">
          <SectionHeading
            badge="Archive"
            title={
              <>
                Past{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                  Events
                </span>
              </>
            }
            subtitle="Browse our archive of past services, conferences, and special programs."
            withDivider
          />
        </div>

        {/* Past event cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {events.map((event) => (
            <EventCard key={event.id} event={event} variant="past" />
          ))}
        </div>

      </div>
    </section>
  );
}