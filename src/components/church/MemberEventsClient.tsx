// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER EVENTS — Dashboard pattern (purple cards, white text)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "./LoadingScreen";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  flyer_url: string | null;
  registration_link: string | null;
  is_upcoming: boolean;
  slug: string;
}

function formatDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MemberEventsClient() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberName, setMemberName] = useState("");

  useEffect(() => {
    loadEvents();
    loadMember();
  }, []);

  const loadMember = () => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.includes("member") || key.includes("tfam")) {
          try {
            const val = localStorage.getItem(key);
            if (val) {
              const parsed = JSON.parse(val);
              if (parsed.full_name) {
                setMemberName(parsed.full_name.split(" ")[0]);
                break;
              }
            }
          } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ }
  };

  const loadEvents = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });
      setEvents(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading events..." />;
  }

  const upcoming = events.filter((e) => e.is_upcoming);
  const past = events.filter((e) => !e.is_upcoming);

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">Events</span>
          </div>
          <p className="text-white/80 font-semibold text-lg mb-1">{getGreeting()}{memberName ? `, ${memberName}` : ""}!</p>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">Church Events</h1>
          <p className="text-brand-purple-100 text-sm md:text-base">Stay updated with upcoming programs and events</p>
          <div className="flex gap-6 pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{upcoming.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Upcoming</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{past.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Past</p>
            </div>
          </div>
        </div>
      </div>

      {/* No Events */}
      {events.length === 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">📅</div>
          <h2 className="font-heading text-xl font-bold text-white mb-2">No Events Yet</h2>
          <p className="text-brand-purple-200 text-sm">Check back soon for upcoming programs</p>
        </div>
      )}

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-white font-heading font-bold text-xl mb-4">📅 Upcoming Events</h2>
          <div className="space-y-3">
            {upcoming.map((event) => (
              <div key={event.id} className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-xl">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="flex flex-col md:flex-row">
                  {event.flyer_url && (
                    <div className="md:w-48 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={event.flyer_url} alt={event.title} className="w-full h-48 md:h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5 flex-1">
                    <p className="font-black text-white text-lg mb-2">{event.title}</p>
                    <p className="text-brand-purple-200 text-sm mb-1">📅 {formatDate(event.event_date)}</p>
                    {event.event_time && <p className="text-brand-purple-200 text-sm mb-1">🕐 {event.event_time}</p>}
                    {event.location && <p className="text-brand-purple-200 text-sm mb-3">📍 {event.location}</p>}
                    {event.description && <p className="text-white/80 text-sm leading-relaxed text-justify">{event.description}</p>}
                    {event.registration_link && (
                      <a href={event.registration_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-sm shadow-gold hover:scale-105 transition-all">
                        Register →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {past.length > 0 && (
        <div>
          <h2 className="text-white font-heading font-bold text-xl mb-4">📋 Past Events</h2>
          <div className="space-y-3">
            {past.map((event) => (
              <div key={event.id} className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900/80 via-brand-purple-800/80 to-brand-purple-900/80 border-2 border-brand-gold-400/30 p-5 shadow-xl opacity-80">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <p className="font-black text-white text-lg mb-1">{event.title}</p>
                <p className="text-brand-purple-200 text-sm">📅 {formatDate(event.event_date)}</p>
                {event.location && <p className="text-brand-purple-300 text-sm">📍 {event.location}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}