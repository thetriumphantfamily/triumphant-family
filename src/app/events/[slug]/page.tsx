// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SINGLE EVENT PAGE — Full event details + registration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { notFound }      from "next/navigation";
import Link              from "next/link";
import type { Metadata } from "next";
import { createClient }                from "@/lib/supabase/server";
import Badge                           from "@/components/ui/Badge";
import { formatDate, formatDateTime } from "@/lib/utils";

// ── Generate metadata for SEO ──
type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("title, description")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!event) return { title: "Event Not Found" };

  return {
    title:       `${event.title} | The Triumphant Family`,
    description: event.description || `Join us for ${event.title}`,
    openGraph: {
      title:       event.title,
      description: event.description || "",
      type:        "website",
    },
  };
}

// ── Page component ──
export default async function EventDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!event) notFound();

  const eventDate = new Date(event.event_date);
  const isPast    = eventDate < new Date();
  const day       = eventDate.getDate();
  const month     = eventDate.toLocaleString("en", { month: "long" }).toUpperCase();
  const year      = eventDate.getFullYear();
  const time      = eventDate.toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" });

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* ━━━ Hero with flyer ━━━ */}
      <section className="bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 pt-10 pb-16 relative overflow-hidden">

        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-brand-magenta-500/15 blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-brand-gold-400/10 blur-3xl" />
        </div>

        <div className="relative z-10 container-custom">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-brand-purple-200 mb-8">
            <Link href="/" className="hover:text-brand-gold-400 transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/events" className="hover:text-brand-gold-400 transition-colors">Events</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-brand-gold-400 font-semibold truncate">{event.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-start max-w-6xl mx-auto">

            {/* Left: Event info */}
            <div className="text-white">

              {/* Status badges */}
              <div className="flex items-center flex-wrap gap-3 mb-5">
                {event.category && (
                  <span className="px-3 py-1 rounded-full bg-brand-gold-400/20 border border-brand-gold-400/40 text-brand-gold-300 text-xs font-bold uppercase tracking-wider capitalize">
                    {event.category}
                  </span>
                )}
                {event.is_online && !isPast && (
                  <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-400/40 text-green-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Online Event
                  </span>
                )}
                {isPast && (
                  <span className="px-3 py-1 rounded-full bg-gray-700 text-gray-200 text-xs font-bold uppercase tracking-wider">
                    Past Event
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                {event.title}
              </h1>

              {/* Description */}
              {event.description && (
                <p className="text-brand-purple-100 text-base md:text-lg leading-relaxed mb-8">
                  {event.description}
                </p>
              )}

              {/* Quick info cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* Date */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold-400/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-brand-gold-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-brand-purple-200 text-xs uppercase font-semibold tracking-wider">Date</p>
                      <p className="text-white font-bold">{formatDate(event.event_date)}</p>
                    </div>
                  </div>
                </div>

                {/* Time */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold-400/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-brand-gold-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-brand-purple-200 text-xs uppercase font-semibold tracking-wider">Time</p>
                      <p className="text-white font-bold">{time}</p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold-400/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-brand-gold-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-brand-purple-200 text-xs uppercase font-semibold tracking-wider">Location</p>
                      <p className="text-white font-bold truncate">
                        {event.is_online ? "Online / Virtual Event" : (event.location || "TBA")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              {!isPast && (
                <div className="flex flex-col sm:flex-row gap-3">
                  {event.registration_required && event.registration_link ? (
                    <a
                      href={event.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-lg shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
                    >
                      Register Now
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </a>
                  ) : event.is_online && event.online_link ? (
                    <a
                      href={event.online_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-lg shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Join Online
                    </a>
                  ) : (
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-lg shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
                    >
                      Contact Us
                    </Link>
                  )}

                  <Link
                    href="/events"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/40 text-white font-bold text-lg hover:bg-white/10 hover:border-white transition-all duration-300"
                  >
                    ← All Events
                  </Link>
                </div>
              )}

              {isPast && (
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/40 text-white font-semibold hover:bg-white/10 hover:border-white transition-all duration-300"
                >
                  ← Back to Events
                </Link>
              )}
            </div>

            {/* Right: Flyer */}
            {event.flyer_url && (
              <div className="hidden lg:block w-[320px] xl:w-[380px]">
                <div className="sticky top-24">
                  <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-brand-gold-400/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={event.flyer_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mobile flyer */}
            {event.flyer_url && (
              <div className="lg:hidden">
                <div className="relative w-full aspect-[3/4] max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-brand-gold-400/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.flyer_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ━━━ Additional info section ━━━ */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">

          <h2 className="font-heading text-2xl font-bold text-brand-purple-900 mb-6">
            Event Information
          </h2>

          <div className="bg-gradient-to-br from-brand-purple-50 to-white border border-brand-purple-100 rounded-3xl p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div>
                <p className="text-brand-purple-700 text-xs uppercase font-bold tracking-wider mb-2">When</p>
                <p className="text-gray-900 font-semibold">{formatDateTime(event.event_date)}</p>
                {event.end_date && (
                  <p className="text-gray-500 text-sm mt-1">
                    Ends: {formatDateTime(event.end_date)}
                  </p>
                )}
              </div>

              <div>
                <p className="text-brand-purple-700 text-xs uppercase font-bold tracking-wider mb-2">Where</p>
                <p className="text-gray-900 font-semibold">
                  {event.is_online ? "Online / Virtual" : (event.location || "To be announced")}
                </p>
              </div>

              <div>
                <p className="text-brand-purple-700 text-xs uppercase font-bold tracking-wider mb-2">Category</p>
                <p className="text-gray-900 font-semibold capitalize">{event.category || "General"}</p>
              </div>

              <div>
                <p className="text-brand-purple-700 text-xs uppercase font-bold tracking-wider mb-2">Registration</p>
                <p className="text-gray-900 font-semibold">
                  {event.registration_required ? "Required" : "Open to all"}
                </p>
              </div>
            </div>
          </div>

          {/* Share/help footer */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Have questions about this event?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-purple-600 text-white font-semibold hover:bg-brand-purple-700 transition-all duration-300 shadow-brand hover:shadow-brand-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}