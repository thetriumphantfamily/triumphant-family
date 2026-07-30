// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER EVENTS CLIENT — View upcoming events from main site
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  flyer_url: string | null;
  is_published: boolean;
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function isUpcoming(d: string): boolean {
  return new Date(d) >= new Date();
}

export default function MemberEventsClient() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("events").select("*").eq("is_published", true).order("start_date", { ascending: true });
      setEvents(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const upcomingEvents = events.filter((e) => isUpcoming(e.start_date));
  const pastEvents = events.filter((e) => !isUpcoming(e.start_date));

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading events...</p></div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">📅 Church Events</h1>
        <p className="text-gray-600 text-sm">Upcoming services, conferences, and programs</p>
      </div>

      {/* Upcoming */}
      <div>
        <h2 className="font-heading font-bold text-brand-purple-900 text-lg mb-4">🔜 Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">No upcoming events at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl p-5 border-2 border-brand-gold-400/40 shadow-md hover:shadow-lg transition-all">
                {event.flyer_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={event.flyer_url} alt={event.title} className="w-full h-48 object-cover rounded-xl mb-4" />
                )}
                <h3 className="font-heading font-bold text-brand-purple-900 text-lg mb-2">{event.title}</h3>
                <p className="text-sm text-gray-500 mb-2">📅 {formatDate(event.start_date)}</p>
                {event.location && <p className="text-sm text-gray-500 mb-2">📍 {event.location}</p>}
                {event.description && <p className="text-gray-700 text-sm leading-relaxed">{event.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="font-heading font-bold text-brand-purple-900 text-lg mb-4">📋 Past Events</h2>
          <div className="space-y-3">
            {pastEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md">
                <h3 className="font-bold text-brand-purple-900 text-sm">{event.title}</h3>
                <p className="text-xs text-gray-500">{formatDate(event.start_date)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}