// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENTS LIST — Interactive event management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import EventsForm from "./EventsForm";

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

const CATEGORY_COLORS: Record<string, string> = {
  service: "bg-purple-100 text-purple-700 border-purple-200",
  conference: "bg-blue-100 text-blue-700 border-blue-200",
  crusade: "bg-red-100 text-red-700 border-red-200",
  prayer: "bg-indigo-100 text-indigo-700 border-indigo-200",
  outreach: "bg-green-100 text-green-700 border-green-200",
  training: "bg-orange-100 text-orange-700 border-orange-200",
  fellowship: "bg-pink-100 text-pink-700 border-pink-200",
  general: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function EventsList({
  initialEvents,
}: {
  initialEvents: Event[];
}) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

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
      const { error } = await supabase
        .from("events")
        .update({ is_published: !current })
        .eq("id", id);

      if (error) throw error;

      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, is_published: !current } : e))
      );
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
      const { error } = await supabase
        .from("events")
        .update({ is_featured: !current })
        .eq("id", id);

      if (error) throw error;

      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, is_featured: !current } : e))
      );
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
      setEvents((prev) => prev.map((e) => (e.id === saved.id ? saved : e)));
    } else {
      setEvents((prev) => [saved, ...prev]);
    }
    setShowForm(false);
    setEditingEvent(null);
    router.refresh();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
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
                  ? "bg-gradient-to-br from-brand-purple-600 to-brand-purple-700 text-white shadow-brand"
                  : "bg-white text-gray-600 border-2 border-gray-200 hover:border-brand-purple-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setEditingEvent(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 hover:from-brand-gold-500 hover:to-brand-gold-600 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
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
          onCancel={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
        />
      )}

      {/* Empty state */}
      {filteredEvents.length === 0 && !showForm && (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-purple-100 mb-4">
            <svg className="w-10 h-10 text-brand-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            {filter === "all" ? "No events yet" : `No ${filter} events`}
          </h3>
          <p className="text-gray-500 mb-4">
            {filter === "all" && "Add your first event to get started"}
            {filter === "upcoming" && "No upcoming events scheduled"}
            {filter === "past" && "No past events yet"}
            {filter === "drafts" && "All events are published"}
            {filter === "featured" && "Feature events to highlight them"}
          </p>
          {filter === "all" && (
            <button
              onClick={() => {
                setEditingEvent(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-bold transition-all"
            >
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
            const categoryColor = event.category
              ? CATEGORY_COLORS[event.category] || CATEGORY_COLORS.general
              : null;

            return (
              <div
                key={event.id}
                className={`relative bg-white rounded-2xl overflow-hidden border-2 transition-all shadow-md hover:shadow-xl ${
                  event.is_published
                    ? "border-gray-100 hover:border-brand-gold-400"
                    : "border-gray-200 opacity-70"
                } ${event.is_featured ? "ring-2 ring-brand-gold-400" : ""} ${
                  isPast ? "grayscale-[30%]" : ""
                }`}
              >
                {/* Featured badge */}
                {event.is_featured && (
                  <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-gold-400 text-brand-purple-900 text-xs font-bold shadow-md">
                    ⭐ Featured
                  </div>
                )}

                {/* Status badges */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
                  {event.is_published ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider">
                      Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-500 text-white text-[10px] font-bold uppercase tracking-wider">
                      Draft
                    </span>
                  )}
                  {isPast && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-700 text-white text-[10px] font-bold uppercase tracking-wider">
                      Past
                    </span>
                  )}
                  {event.is_online && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider">
                      🌐 Online
                    </span>
                  )}
                </div>

                {/* Flyer */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-violet-900 to-brand-purple-900 overflow-hidden">
                  {event.flyer_url ? (
                    <Image
                      src={event.flyer_url}
                      alt={event.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-white/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  {event.category && categoryColor && (
                    <span className={`inline-block px-2 py-0.5 rounded-full border text-xs font-bold mb-2 ${categoryColor}`}>
                      {event.category}
                    </span>
                  )}

                  <h3 className="font-heading font-bold text-brand-purple-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <svg className="w-4 h-4 text-brand-purple-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                      </svg>
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <svg className="w-4 h-4 text-brand-purple-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                    {event.registration_required && (
                      <div className="flex items-center gap-2 text-xs text-brand-purple-600 font-semibold">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                        </svg>
                        <span>Registration required</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setEditingEvent(event);
                        setShowForm(true);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-xs font-bold transition-all"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => togglePublished(event.id, event.is_published)}
                      disabled={isBusy}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {event.is_published ? "🙈" : "👁️"}
                    </button>
                    <button
                      onClick={() => toggleFeatured(event.id, event.is_featured)}
                      disabled={isBusy}
                      className={`inline-flex items-center justify-center px-2 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-50 ${
                        event.is_featured
                          ? "bg-brand-gold-100 border-2 border-brand-gold-300 text-brand-gold-700"
                          : "bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-500"
                      }`}
                    >
                      ⭐
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id, event.title)}
                      disabled={isBusy}
                      className="inline-flex items-center justify-center px-2 py-1.5 rounded-full bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 text-xs font-bold transition-all disabled:opacity-50"
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