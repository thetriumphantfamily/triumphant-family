// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENTS LIST — Interactive event management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import EventsForm from "./EventsForm";
import LoadingScreen from "@/components/church/LoadingScreen";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  event_date: string;
  location: string | null;
  is_online: boolean;
  online_link: string | null;
  flyer_url: string | null;
  registration_required: boolean;
  registration_link: string | null;
  category: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

type FilterType = "all" | "upcoming" | "past" | "drafts" | "featured";

export default function EventsList({ initialEvents }: { initialEvents: Event[] }) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading] = useState(false);

  if (loading) return <LoadingScreen message="Loading events..." />;

  const now = new Date();
  const filteredEvents = events.filter((e) => {
    const eventDate = new Date(e.event_date);
    if (filter === "upcoming") return eventDate >= now && e.is_published;
    if (filter === "past") return eventDate < now;
    if (filter === "drafts") return !e.is_published;
    if (filter === "featured") return e.is_featured;
    return true;
  });

  const togglePublished = async (id: string, current: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("events").update({ is_published: !current }).eq("id", id);
      if (error) throw error;
      setEvents((prev) => prev.map((e) => e.id === id ? { ...e, is_published: !current } : e));
      toast.success(current ? "Unpublished" : "✅ Published!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update");
    } finally {
      setBusyId(null);
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("events").update({ is_featured: !current }).eq("id", id);
      if (error) throw error;
      setEvents((prev) => prev.map((e) => e.id === id ? { ...e, is_featured: !current } : e));
      toast.success(current ? "Unfeatured" : "⭐ Featured!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update");
    } finally {
      setBusyId(null);
    }
  };

  const deleteEvent = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Event deleted");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not delete");
    } finally {
      setBusyId(null);
    }
  };

  const handleFormSuccess = (saved: Event, isEdit: boolean) => {
    if (isEdit) {
      setEvents((prev) => prev.map((e) => e.id === saved.id ? saved : e));
    } else {
      setEvents((prev) => [saved, ...prev]);
    }
    setShowForm(false);
    setEditingEvent(null);
    router.refresh();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  };

  const isPastEvent = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <div>
      {/* Actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all" as const, label: "All" },
            { value: "upcoming" as const, label: "Upcoming" },
            { value: "past" as const, label: "Past" },
            { value: "drafts" as const, label: "Drafts" },
            { value: "featured" as const, label: "Featured" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                filter === tab.value
                  ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                  : "bg-white text-brand-purple-900 font-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setEditingEvent(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Event
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <EventsForm
          event={editingEvent}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowForm(false); setEditingEvent(null); }}
        />
      )}

      {/* Empty state */}
      {filteredEvents.length === 0 && !showForm && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-12 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">📅</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">
            {filter === "all" ? "No events yet" : `No ${filter} events`}
          </h3>
          <p className="text-brand-purple-200 font-semibold mb-4">
            {filter === "all" && "Add your first event to get started"}
            {filter === "upcoming" && "No upcoming events scheduled"}
            {filter === "past" && "No past events yet"}
            {filter === "drafts" && "All events are published"}
            {filter === "featured" && "Feature events to highlight them"}
          </p>
          {filter === "all" && (
            <button onClick={() => { setEditingEvent(null); setShowForm(true); }} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all">
              + Add First Event
            </button>
          )}
        </div>
      )}

      {/* Events grid */}
      {filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const isBusy = busyId === event.id;
            const isPast = isPastEvent(event.event_date);

            return (
              <div
                key={event.id}
                className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl ${event.is_featured ? "border-brand-gold-400" : "border-brand-gold-400/40"} ${isPast ? "opacity-70" : ""}`}
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                {/* Featured badge */}
                {event.is_featured && (
                  <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 text-xs font-black shadow-md">
                    ⭐ Featured
                  </div>
                )}

                {/* Status badges */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
                  {event.is_published ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-black uppercase tracking-wider">Live</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-purple-950/80 text-white text-[10px] font-black uppercase tracking-wider border border-brand-gold-400/40">Draft</span>
                  )}
                  {isPast && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-purple-950/80 text-white text-[10px] font-black uppercase tracking-wider border border-brand-gold-400/40">Past</span>
                  )}
                  {event.is_online && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider">🌍 Online</span>
                  )}
                </div>

                {/* Flyer */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {event.flyer_url ? (
                    <img src={event.flyer_url} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-purple-950/40">
                      <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  {event.category && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-black bg-brand-purple-950/60 text-white border border-brand-gold-400/40 mb-2">
                      {event.category}
                    </span>
                  )}
                  <h3 className="font-heading font-black text-white mb-2 line-clamp-2">{event.title}</h3>
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center gap-2 text-xs text-brand-purple-200 font-semibold">
                      <svg className="w-4 h-4 text-brand-gold-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                      </svg>
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-xs text-brand-purple-200 font-semibold">
                        <svg className="w-4 h-4 text-brand-gold-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                    {event.registration_required && (
                      <div className="flex items-center gap-2 text-xs text-brand-gold-400 font-semibold">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                        </svg>
                        <span>Registration required</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 pt-3 border-t border-brand-gold-400/30">
                    <button
                      onClick={() => { setEditingEvent(event); setShowForm(true); }}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-full bg-white text-brand-purple-900 text-xs font-black transition-all"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => togglePublished(event.id, event.is_published)}
                      disabled={isBusy}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-full bg-brand-purple-950/60 text-white border border-brand-gold-400/40 text-xs font-black transition-all disabled:opacity-50"
                    >
                      {event.is_published ? "🙈" : "👁️"}
                    </button>
                    <button
                      onClick={() => toggleFeatured(event.id, event.is_featured)}
                      disabled={isBusy}
                      className={`inline-flex items-center justify-center px-2 py-1.5 rounded-full text-xs font-black transition-all disabled:opacity-50 ${
                        event.is_featured
                          ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900"
                          : "bg-brand-purple-950/60 text-white border border-brand-gold-400/40"
                      }`}
                    >
                      ⭐
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id, event.title)}
                      disabled={isBusy}
                      className="inline-flex items-center justify-center px-2 py-1.5 rounded-full bg-red-600 text-white text-xs font-black transition-all disabled:opacity-50"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}